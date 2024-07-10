import { Header } from "./Header"

interface Props {
    children: React.ReactNode
}
export const Page = (props: Props) => {
    return (
        <div>
            <Header />
            <div className={""}>
                {props.children}
            </div>
        </div>
    )
}