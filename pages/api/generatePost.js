import { OpenAIApi, Configuration } from "openai";
import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  // basePath: process.env.OPENAI_BASE_URL
});

const api = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { topic, keywords } = req.body;
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("genaiBlog");
  const userProfile = await db.collection('users').findOne(
    {
      auth0Id: user.sub,
    }
  );

  if (!userProfile || userProfile.availableTokens <=0) {
    return res.status(403).json({ error: 'Not enough tokens' })
  }

  const response = await api.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: "You are an SEO friendly blog post generator called BlogStand. You are designed to output markdown without frontmatter",
      },
      {
        role: 'user',
        content: `Generate a blog post on the following topic deleminted by triple hyphens:
        --- 
         ${topic}
        --- 
        targating the following keywords deleminited by triple hyphens:
        ---
        ${keywords}
        ---
        `,

      },
    ]
  })

  const postContent = response.data?.choices[0]?.message?.content;

  const seoResponse = await api.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: "You are an SEO friendly blog post generator called BlogStand. You are designed to output json",
      },
      {
        role: 'user',
        content: `Generate a seo friendly title and seo friendly meta description for the following topic deleminted by triple hyphens:
        --- 
         ${postContent}
        --- 
        output in json format should be like:
        {
          "title": "Your title here",
          "metaDescription": "Your meta description here"
        }
        `,

      },
    ]
    ,
  })

  await db.collection('users').updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1
      }
    }
  );

  const seoResponseJson = JSON.parse(seoResponse.data?.choices[0]?.message?.content);
  const { title, metaDescription } = seoResponseJson;

  const newPost = await db.collection('posts').insertOne({
    postContent,
    title,
    metaDescription,
    keywords,
    user: userProfile._id,
    createdAt: new Date()
  })

  res.status(200).json({ postId: newPost.insertedId})
}
