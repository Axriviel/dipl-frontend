import { Header } from "./Header"

interface Props {
    children: React.ReactNode
}
export const Page = (props: Props) => {
    return (
        <div className="h-100">
            <Header />
            <div className={"h-100"}>
                {props.children}
            </div>
        </div>
    )
}