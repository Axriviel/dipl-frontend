import { Badge, Button, Form } from "react-bootstrap"
import { HelpfulTip } from "./Tooltip"
import { useState } from "react";


interface Props {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TagsForm: React.FC<Props> = ({ tags, setTags }) => {
    const [tagInput, setTagInput] = useState<string>("");
    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };
    return (
        <>
            < Form.Label > Tags: <HelpfulTip text="Model tags which are primarily used in tagging opt. method" /></Form.Label >
            <div className="d-flex">
                <Form.Control
                    type="text"
                    placeholder="Enter a tag and press Add"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                />
                <Button className="ms-2" onClick={handleAddTag}>
                    Add
                </Button>
            </div>

            <div className="mt-2 d-flex flex-wrap tags-container">
                {tags.length > 0 ? (
                    tags.map((tag, index) => (
                        <Badge
                            key={index}
                            bg="primary"
                            className="tag mx-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRemoveTag(tag)}
                        >
                            {tag} ✖
                        </Badge>
                    ))
                ) : (
                    <p>No tags added yet.</p>
                )}
            </div>
        </>
    )
}
