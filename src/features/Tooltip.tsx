import Tippy from "@tippyjs/react"
interface Props {
    text: string,
    placement?: "top"
}

export const HelpfulTip = ({ text, placement }: Props) => {
    return (
        <Tippy content={text} placement={placement}>
            <svg className="tip-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#1C274C" stroke-width="1.5"></circle> <path d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <circle cx="12" cy="16" r="1" fill="#1C274C"></circle> </g></svg>
        </Tippy>
    )
}

