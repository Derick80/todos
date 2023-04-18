import { Link } from '@remix-run/react'

export default function TopNav(){

    return (
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
            <ul className="flex items-center flex-shrink-0 text-white mr-6">
                <li className="mr-6">
                    <Link to="/">Home</Link>
                </li>
                <li className="mr-6">
                    <Link to="/todos">Todos</Link>
                </li>
                <li className="mr-6">
                    <Link to="/beta">Beta</Link>
                </li>
            </ul>

            </nav>
    )
}