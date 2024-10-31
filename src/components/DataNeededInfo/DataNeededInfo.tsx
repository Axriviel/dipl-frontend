import "./DataNeededInfo.css"

interface Props {
    content: string;
    imageUrl: string;
}

export const DataNeededInfo: React.FC<Props> = ({ content, imageUrl }) => {
    return (
        <div className="d-flex flex-column align-items-center p-5">

            <div className="info-card mt-3">
                <div>
                    <img src={imageUrl} alt="Informativní obrázek" className="info-image" />
                </div>
                <div className="info-content">
                    {content}
                </div>
            </div>
        </div>
    )
}