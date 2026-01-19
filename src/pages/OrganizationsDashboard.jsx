import { useState, useEffect } from 'react';
import { Plus, Building2, TrendingUp, DollarSign, Activity, Search, Filter, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import AddOrganizationModal from '../components/AddOrganizationModal';
import './OrganizationsDashboard.css';

const OrganizationsDashboard = () => {
    const [organizations, setOrganizations] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrganizations();
        fetchAllTransactions();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/organizations');
            const data = await response.json();
            if (data.success) {
                setOrganizations(data.data);
            }
        } catch (error) {
            toast.error('Error fetching organizations');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllTransactions = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/transactions');
            const data = await response.json();
            if (data.success) {
                setTransactions(data.data);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchOrgTransactions = async (orgId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/organizations/${orgId}/transactions`);
            const data = await response.json();
            if (data.success) {
                setTransactions(data.data);
                setSelectedOrg(orgId);
            }
        } catch (error) {
            toast.error('Error fetching organization transactions');
            console.error('Error:', error);
        }
    };

    const handleOrgClick = (orgId) => {
        if (selectedOrg === orgId) {
            setSelectedOrg(null);
            fetchAllTransactions();
        } else {
            fetchOrgTransactions(orgId);
        }
    };

    const getOrgStats = (orgId) => {
        const orgTransactions = transactions.filter(t => t.organization_id === orgId);
        const totalAmount = orgTransactions.reduce((sum, t) => sum + t.amount, 0);
        const successCount = orgTransactions.filter(t => t.status === 'success').length;
        const pendingCount = orgTransactions.filter(t => t.status === 'pending').length;

        return {
            total: orgTransactions.length,
            totalAmount,
            successCount,
            pendingCount
        };
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.uuid?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return '#48bb78';
            case 'pending': return '#ed8936';
            case 'failed': return '#f56565';
            case 'expired': return '#a0aec0';
            default: return '#718096';
        }
    };

    const formatCurrency = (amount, currency = 'GBP') => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading organizations...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <Building2 size={40} />
                        <div>
                            <h1>Organizations Dashboard</h1>
                            <p>Manage organizations and track their transactions</p>
                        </div>
                    </div>
                    <button className="add-org-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} />
                        Add Organization
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Organizations Grid */}
                <div className="organizations-section">
                    <h2 className="section-title">
                        <Building2 size={24} />
                        Organizations ({organizations.length})
                    </h2>

                    {organizations.length === 0 ? (
                        <div className="empty-state">
                            <Building2 size={64} />
                            <h3>No Organizations Yet</h3>
                            <p>Get started by adding your first organization</p>
                            <button className="add-org-btn" onClick={() => setIsModalOpen(true)}>
                                <Plus size={20} />
                                Add Organization
                            </button>
                        </div>
                    ) : (
                        <div className="organizations-grid">
                            {organizations.map((org) => {
                                const stats = getOrgStats(org.organization_id);
                                const isSelected = selectedOrg === org.organization_id;

                                return (
                                    <div
                                        key={org._id}
                                        className={`org-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleOrgClick(org.organization_id)}
                                    >
                                        <div className="org-card-header">
                                            <div className="org-icon">
                                                <Building2 size={24} />
                                            </div>
                                            <div className="org-info">
                                                <h3>{org.name}</h3>
                                                <p className="org-id">{org.organization_id}</p>
                                            </div>
                                        </div>

                                        <div className="org-stats">
                                            <div className="stat-item">
                                                <Activity size={16} />
                                                <div>
                                                    <span className="stat-value">{stats.total}</span>
                                                    <span className="stat-label">Transactions</span>
                                                </div>
                                            </div>
                                            <div className="stat-item">
                                                <DollarSign size={16} />
                                                <div>
                                                    <span className="stat-value">{formatCurrency(stats.totalAmount)}</span>
                                                    <span className="stat-label">Total Revenue</span>
                                                </div>
                                            </div>
                                            <div className="stat-item">
                                                <TrendingUp size={16} />
                                                <div>
                                                    <span className="stat-value">{stats.successCount}</span>
                                                    <span className="stat-label">Successful</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="org-footer">
                                            <span className="org-email">{org.owner_email}</span>
                                            <span className={`org-status ${org.status}`}>
                                                {org.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Transactions Table */}
                <div className="transactions-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <Activity size={24} />
                            {selectedOrg ? 'Organization Transactions' : 'All Transactions'} ({filteredTransactions.length})
                        </h2>

                        <div className="filters">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="filter-dropdown">
                                <Filter size={18} />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="success">Success</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="expired">Expired</option>
                                </select>
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    {filteredTransactions.length === 0 ? (
                        <div className="empty-state">
                            <Activity size={64} />
                            <h3>No Transactions Found</h3>
                            <p>No transactions match your current filters</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="transactions-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Provider</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction._id}>
                                            <td className="order-id">{transaction.order_id}</td>
                                            <td>
                                                <div className="customer-info">
                                                    <span className="customer-name">{transaction.customer_name}</span>
                                                    <span className="customer-email">{transaction.customer_email}</span>
                                                </div>
                                            </td>
                                            <td className="amount">
                                                {formatCurrency(transaction.amount, transaction.currency)}
                                            </td>
                                            <td>
                                                <span
                                                    className="status-badge"
                                                    style={{
                                                        backgroundColor: `${getStatusColor(transaction.status)}20`,
                                                        color: getStatusColor(transaction.status)
                                                    }}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="provider">
                                                {transaction.provider || 'N/A'}
                                            </td>
                                            <td className="date">
                                                {formatDate(transaction.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <AddOrganizationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchOrganizations();
                    fetchAllTransactions();
                }}
            />
        </div>
    );
};

export default OrganizationsDashboard;
