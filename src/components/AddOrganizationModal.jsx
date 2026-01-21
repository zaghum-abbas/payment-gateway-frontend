import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import './AddOrganizationModal.css';

const AddOrganizationModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        owner_email: '',
        organization_id: '',
        api_token: ''
    });
    const [loading, setLoading] = useState(false);
    const [generatedToken, setGeneratedToken] = useState('');

    const generateRandomToken = () => {
        const token = 'org_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setFormData({ ...formData, api_token: token });
        return token;
    };

    const generateOrgId = () => {
        const orgId = 'ORG_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9).toUpperCase();
        setFormData({ ...formData, organization_id: orgId });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/organizations/add-organization`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setGeneratedToken(data.data.api_token);
                toast.success('Organization added successfully!');
                setTimeout(() => {
                    onSuccess();
                    handleClose();
                }, 2000);
            } else {
                toast.error(data.message || 'Failed to add organization');
            }
        } catch (error) {
            toast.error('Error adding organization');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            owner_email: '',
            organization_id: '',
            api_token: ''
        });
        setGeneratedToken('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Organization</h2>
                    <button className="close-btn" onClick={handleClose}>
                        <X size={24} />
                    </button>
                </div>

                {generatedToken ? (
                    <div className="token-display">
                        <div className="success-icon">✓</div>
                        <h3>Organization Created Successfully!</h3>
                        <div className="token-warning">
                            <p>⚠️ Save this API token - it won't be shown again!</p>
                            <div className="token-box">
                                <code>{generatedToken}</code>
                            </div>
                            <button
                                className="copy-btn"
                                onClick={() => {
                                    navigator.clipboard.writeText(generatedToken);
                                    toast.success('Token copied to clipboard!');
                                }}
                            >
                                Copy Token
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="org-form">
                        <div className="form-group">
                            <label htmlFor="name">Organization Name *</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Enter organization name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="owner_email">Owner Email *</label>
                            <input
                                type="email"
                                id="owner_email"
                                value={formData.owner_email}
                                onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                                required
                                placeholder="owner@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="organization_id">Organization ID *</label>
                            <div className="input-with-button">
                                <input
                                    type="text"
                                    id="organization_id"
                                    value={formData.organization_id}
                                    onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
                                    required
                                    placeholder="ORG_XXXXX"
                                />
                                <button
                                    type="button"
                                    className="generate-btn"
                                    onClick={generateOrgId}
                                >
                                    Generate
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="api_token">API Token *</label>
                            <div className="input-with-button">
                                <input
                                    type="text"
                                    id="api_token"
                                    value={formData.api_token}
                                    onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                                    required
                                    placeholder="org_xxxxxxxxxxxxx"
                                />
                                <button
                                    type="button"
                                    className="generate-btn"
                                    onClick={generateRandomToken}
                                >
                                    Generate
                                </button>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Organization'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddOrganizationModal;
