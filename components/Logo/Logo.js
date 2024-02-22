import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Logo() {
    return (
        <div className="flex justify-center items-center gap-2 py-4">
            <div className="text-white font-semibold text-3xl font-heading">Blog Standard</div>
            <FontAwesomeIcon icon={faBrain} className="text-2xl text-slate-400" />
        </div>
    )
}