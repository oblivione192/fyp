import { Card } from "react-bootstrap" 
import { IoMdArrowBack } from "react-icons/io" 
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
export default function ProfileCard({ userType,userDetails, userName, pictureDir, headers, updateHandler }) {
    const [editMode, setEditMode] = useState(false);
    const [changes, setChanges] = useState({});

    const handleInputChange = (accessor, value) => {
        setChanges(prev => ({
            ...prev,
            [accessor]: value
        }));
    };

    return (
        <Card style={{ overflowY: 'auto', maxHeight: '100%' }}>
            <div onClick={() => window.history.back()} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1rem' }}>
                <IoMdArrowBack />
                <span style={{ marginLeft: '0.5rem' }}>Back</span>
            </div>

            <Card.Title className="title">Personal Info</Card.Title>

            <div className="verticalSection">
                <CgProfile className="profileIcon" />
                <p>{userName}</p>
            </div>

            {
                headers.map((header, index) => {
                    const accessor = header.accessor;
                    const currentValue = userDetails[accessor] ?? '';
                    const editedValue = changes[accessor] ?? currentValue;

                    return (
                        <div className="horizontalSection" key={index}>
                            <p>{header.title}</p>

                            {
                                editMode ? (
                                    <input
                                        type="text"
                                        value={editedValue}
                                        onChange={(e) => handleInputChange(accessor, e.target.value)}
                                    />
                                ) : (
                                    <p>{currentValue || 'N/A'}</p>
                                )
                            }
                        </div>
                    );
                })
            }

            <div className="horizontalSection" style={{ marginTop: '1rem' }}>
                <button onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Cancel' : 'Edit'}
                </button>
                {
                    editMode && (
                        <button onClick={() => { 
                            console.log(userType); 
                            updateHandler(changes,userType);
                            setEditMode(false);
                        }}>
                            Save Changes
                        </button>
                    )
                }
            </div>
        </Card>
    );
}