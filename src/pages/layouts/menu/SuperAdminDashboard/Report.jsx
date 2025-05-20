import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const modules = {
  patients: {
    filters: ['age', 'gender', 'healthIdStatus'],
    charts: ['distribution', 'trend', 'status']
  },
  doctors: {
    filters: ['specialty', 'status', 'experience'],
    charts: ['specialty', 'revenue', 'appointments']
  },
  pharmacies: {
    filters: ['location', 'status', 'revenue'],
    charts: ['sales', 'prescriptions', 'inventory']
  },
  labs: {
    filters: ['testType', 'location', 'revenue'],
    charts: ['popularity', 'revenue', 'bookings']
  },
  payments: {
    filters: ['status', 'method', 'dateRange'],
    charts: ['trend', 'distribution', 'refunds']
  },
  hospitals: {
    filters: ['type', 'status', 'capacity'],
    charts: ['occupancy', 'revenue', 'services']
  }
};

const moduleFilters = {
  patients: {
    age: [
      { value: '0-18', label: '0-18 years' },
      { value: '19-30', label: '19-30 years' },
      { value: '31-45', label: '31-45 years' },
      { value: '46-60', label: '46-60 years' },
      { value: '60+', label: '60+ years' }
    ],
    gender: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ],
    healthIdStatus: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' }
    ]
  },
  doctors: {
    specialty: [
      { value: 'general', label: 'General Medicine' },
      { value: 'cardiology', label: 'Cardiology' },
      { value: 'neurology', label: 'Neurology' },
      { value: 'pediatrics', label: 'Pediatrics' },
      { value: 'orthopedics', label: 'Orthopedics' }
    ],
    status: [
      { value: 'active', label: 'Active' },
      { value: 'on_leave', label: 'On Leave' },
      { value: 'inactive', label: 'Inactive' }
    ],
    experience: [
      { value: '0-5', label: '0-5 years' },
      { value: '6-10', label: '6-10 years' },
      { value: '11-15', label: '11-15 years' },
      { value: '15+', label: '15+ years' }
    ]
  },
  pharmacies: {
    location: [
      { value: 'north', label: 'North Zone' },
      { value: 'south', label: 'South Zone' },
      { value: 'east', label: 'East Zone' },
      { value: 'west', label: 'West Zone' }
    ],
    status: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'maintenance', label: 'Under Maintenance' }
    ],
    revenue: [
      { value: 'high', label: 'High Revenue' },
      { value: 'medium', label: 'Medium Revenue' },
      { value: 'low', label: 'Low Revenue' }
    ]
  },
  labs: {
    testType: [
      { value: 'blood', label: 'Blood Tests' },
      { value: 'imaging', label: 'Imaging' },
      { value: 'pathology', label: 'Pathology' },
      { value: 'specialized', label: 'Specialized Tests' }
    ],
    location: [
      { value: 'north', label: 'North Zone' },
      { value: 'south', label: 'South Zone' },
      { value: 'east', label: 'East Zone' },
      { value: 'west', label: 'West Zone' }
    ],
    revenue: [
      { value: 'high', label: 'High Revenue' },
      { value: 'medium', label: 'Medium Revenue' },
      { value: 'low', label: 'Low Revenue' }
    ]
  },
  payments: {
    status: [
      { value: 'completed', label: 'Completed' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Failed' },
      { value: 'refunded', label: 'Refunded' }
    ],
    method: [
      { value: 'credit_card', label: 'Credit Card' },
      { value: 'debit_card', label: 'Debit Card' },
      { value: 'upi', label: 'UPI' },
      { value: 'net_banking', label: 'Net Banking' },
      { value: 'cash', label: 'Cash' }
    ],
    dateRange: [
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' },
      { value: 'quarter', label: 'This Quarter' },
      { value: 'year', label: 'This Year' }
    ]
  },
  hospitals: {
    type: [
      { value: 'general', label: 'General Hospital' },
      { value: 'specialty', label: 'Specialty Hospital' },
      { value: 'teaching', label: 'Teaching Hospital' },
      { value: 'research', label: 'Research Hospital' }
    ],
    status: [
      { value: 'active', label: 'Active' },
      { value: 'maintenance', label: 'Under Maintenance' },
      { value: 'inactive', label: 'Inactive' }
    ],
    capacity: [
      { value: 'small', label: 'Small (< 100 beds)' },
      { value: 'medium', label: 'Medium (100-500 beds)' },
      { value: 'large', label: 'Large (> 500 beds)' }
    ]
  }
};

const defaultData = {
  total: 0,
  growth: 0,
  revenue: 0,
  conversion: 0,
  trend: [],
  distribution: [],
  metrics: []
};

const mockData = {
  patients: {
    total: 1500,
    growth: 12.5,
    revenue: 75000,
    conversion: 65,
    trend: [30, 45, 60, 75, 90, 85, 100],
    distribution: [
      { label: 'Male', value: 45 },
      { label: 'Female', value: 55 }
    ],
    metrics: [
      { label: 'New Patients', value: 150 },
      { label: 'Returning', value: 200 },
      { label: 'Active', value: 300 },
      { label: 'Inactive', value: 50 }
    ],
    details: {
      ageGroups: [
        { range: '0-18', count: 200, percentage: 13.3 },
        { range: '19-30', count: 450, percentage: 30 },
        { range: '31-45', count: 400, percentage: 26.7 },
        { range: '46-60', count: 300, percentage: 20 },
        { range: '60+', count: 150, percentage: 10 }
      ],
      healthStatus: [
        { status: 'Healthy', count: 800, percentage: 53.3 },
        { status: 'Under Treatment', count: 500, percentage: 33.3 },
        { status: 'Critical', count: 200, percentage: 13.4 }
      ],
      insurance: [
        { type: 'Private', count: 600, percentage: 40 },
        { type: 'Government', count: 700, percentage: 46.7 },
        { type: 'Uninsured', count: 200, percentage: 13.3 }
      ]
    }
  },
  doctors: {
    total: 50,
    growth: 8.3,
    revenue: 120000,
    conversion: 75,
    trend: [20, 25, 30, 35, 40, 45, 50],
    distribution: [
      { label: 'General', value: 30 },
      { label: 'Specialist', value: 70 }
    ],
    metrics: [
      { label: 'Active', value: 35 },
      { label: 'On Leave', value: 5 },
      { label: 'Part-time', value: 10 }
    ],
    details: {
      specialties: [
        { name: 'Cardiology', count: 8, percentage: 16 },
        { name: 'Neurology', count: 6, percentage: 12 },
        { name: 'Pediatrics', count: 7, percentage: 14 },
        { name: 'Orthopedics', count: 5, percentage: 10 },
        { name: 'General Medicine', count: 24, percentage: 48 }
      ],
      experience: [
        { range: '0-5 years', count: 15, percentage: 30 },
        { range: '6-10 years', count: 20, percentage: 40 },
        { range: '11-15 years', count: 10, percentage: 20 },
        { range: '15+ years', count: 5, percentage: 10 }
      ],
      availability: [
        { status: 'Full-time', count: 35, percentage: 70 },
        { status: 'Part-time', count: 10, percentage: 20 },
        { status: 'On-call', count: 5, percentage: 10 }
      ]
    }
  },
  pharmacies: {
    total: 25,
    growth: 15.2,
    revenue: 95000,
    conversion: 82,
    trend: [15, 18, 20, 22, 25, 23, 25],
    distribution: [
      { label: 'North Zone', value: 30 },
      { label: 'South Zone', value: 25 },
      { label: 'East Zone', value: 20 },
      { label: 'West Zone', value: 25 }
    ],
    metrics: [
      { label: 'Active', value: 20 },
      { label: 'Under Maintenance', value: 3 },
      { label: 'Inactive', value: 2 }
    ],
    details: {
      inventory: [
        { category: 'Prescription Drugs', count: 5000, value: 45000 },
        { category: 'OTC Medicines', count: 3000, value: 25000 },
        { category: 'Medical Supplies', count: 2000, value: 15000 },
        { category: 'Health Products', count: 1000, value: 10000 }
      ],
      sales: [
        { period: 'Morning', revenue: 35000, percentage: 36.8 },
        { period: 'Afternoon', revenue: 40000, percentage: 42.1 },
        { period: 'Evening', revenue: 20000, percentage: 21.1 }
      ],
      prescriptions: [
        { type: 'Digital', count: 1500, percentage: 60 },
        { type: 'Paper', count: 1000, percentage: 40 }
      ]
    }
  },
  labs: {
    total: 15,
    growth: 10.5,
    revenue: 85000,
    conversion: 78,
    trend: [10, 12, 13, 14, 15, 14, 15],
    distribution: [
      { label: 'Blood Tests', value: 40 },
      { label: 'Imaging', value: 30 },
      { label: 'Pathology', value: 20 },
      { label: 'Specialized', value: 10 }
    ],
    metrics: [
      { label: 'Active', value: 12 },
      { label: 'Under Maintenance', value: 2 },
      { label: 'Inactive', value: 1 }
    ],
    details: {
      testTypes: [
        { name: 'Blood Tests', count: 5000, revenue: 35000 },
        { name: 'X-Ray', count: 2000, revenue: 20000 },
        { name: 'MRI', count: 500, revenue: 15000 },
        { name: 'CT Scan', count: 300, revenue: 10000 },
        { name: 'Specialized Tests', count: 200, revenue: 5000 }
      ],
      bookings: [
        { status: 'Scheduled', count: 300, percentage: 40 },
        { status: 'Completed', count: 350, percentage: 46.7 },
        { status: 'Cancelled', count: 100, percentage: 13.3 }
      ],
      turnaround: [
        { type: 'Same Day', count: 400, percentage: 53.3 },
        { type: 'Next Day', count: 250, percentage: 33.3 },
        { type: 'Extended', count: 100, percentage: 13.4 }
      ]
    }
  },
  payments: {
    total: 5000,
    growth: 18.7,
    revenue: 250000,
    conversion: 92,
    trend: [3000, 3500, 4000, 4500, 5000, 4800, 5000],
    distribution: [
      { label: 'Credit Card', value: 40 },
      { label: 'Debit Card', value: 30 },
      { label: 'UPI', value: 20 },
      { label: 'Cash', value: 10 }
    ],
    metrics: [
      { label: 'Successful', value: 4600 },
      { label: 'Pending', value: 300 },
      { label: 'Failed', value: 100 }
    ],
    details: {
      transactions: [
        { method: 'Credit Card', count: 2000, amount: 100000 },
        { method: 'Debit Card', count: 1500, amount: 75000 },
        { method: 'UPI', count: 1000, amount: 50000 },
        { method: 'Cash', count: 500, amount: 25000 }
      ],
      status: [
        { status: 'Completed', count: 4600, percentage: 92 },
        { status: 'Pending', count: 300, percentage: 6 },
        { status: 'Failed', count: 100, percentage: 2 }
      ],
      refunds: [
        { reason: 'Service Not Provided', count: 50, amount: 5000 },
        { reason: 'Patient Request', count: 30, amount: 3000 },
        { reason: 'System Error', count: 20, amount: 2000 }
      ]
    }
  },
  hospitals: {
    total: 30,
    growth: 9.8,
    revenue: 180000,
    conversion: 85,
    trend: [25, 27, 28, 29, 30, 29, 30],
    distribution: [
      { label: 'General', value: 40 },
      { label: 'Specialty', value: 30 },
      { label: 'Teaching', value: 20 },
      { label: 'Research', value: 10 }
    ],
    metrics: [
      { label: 'Active', value: 25 },
      { label: 'Under Maintenance', value: 3 },
      { label: 'Inactive', value: 2 }
    ],
    details: {
      departments: [
        { name: 'Emergency', count: 30, occupancy: 85, revenue: 45000 },
        { name: 'Surgery', count: 30, occupancy: 75, revenue: 60000 },
        { name: 'ICU', count: 30, occupancy: 90, revenue: 35000 },
        { name: 'Outpatient', count: 30, occupancy: 65, revenue: 40000 }
      ],
      services: [
        { type: 'Emergency Care', count: 5000, revenue: 25000 },
        { type: 'Surgical Procedures', count: 3000, revenue: 45000 },
        { type: 'Diagnostic Tests', count: 8000, revenue: 20000 },
        { type: 'Consultations', count: 12000, revenue: 30000 }
      ],
      occupancy: [
        { period: 'Morning', rate: 75, patients: 2250 },
        { period: 'Afternoon', rate: 85, patients: 2550 },
        { period: 'Evening', rate: 65, patients: 1950 }
      ]
    }
  }
};

const API_ENDPOINT = 'https://mocki.io/v1/13194716-4782-4ec3-a4a4-a9613931ee7f';

const validateApiResponse = (data) => {
  if (!data || typeof data !== 'object') throw new Error('Invalid API response format');
  const requiredModules = ['patients', 'doctors', 'pharmacies', 'labs', 'payments'];
  const missingModules = requiredModules.filter(module => !(module in data));
  if (missingModules.length > 0) throw new Error(`Missing required modules: ${missingModules.join(', ')}`);
  return true;
};

const formatValue = (key, value) => {
  if (typeof value === 'number') {
    if (key.includes('revenue') || key.includes('value') || key.includes('amount') || key.includes('billAmount')) {
      return `₹${Math.round(value).toLocaleString('en-IN')}`;
    }
    if (key.includes('percentage') || key.includes('rate') || key.includes('occupancy')) {
      return `${Math.round(value)}%`;
    }
    return Math.round(value).toLocaleString('en-IN');
  }
  return value;
};

const ReportsAnalytics = () => {
  const [selectedModule, setSelectedModule] = useState('patients');
  const [timePeriod, setTimePeriod] = useState('today');
  const [outputFormat, setOutputFormat] = useState('json');
  const [displayFormat, setDisplayFormat] = useState('graph');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchData();
  }, [selectedModule, timePeriod, outputFormat, filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const moduleData = mockData[selectedModule];
      console.log('Using mock data for module:', selectedModule);
      console.log('Applied filters:', filters);
      let filteredData = { ...moduleData };

      if (Object.keys(filters).length > 0) {
        switch (selectedModule) {
          case 'patients':
            if (filters.age) filteredData.details.ageGroups = moduleData.details.ageGroups.filter(group => group.range === filters.age);
            if (filters.gender) filteredData.distribution = moduleData.distribution.filter(item => item.label.toLowerCase() === filters.gender);
            if (filters.healthIdStatus) filteredData.metrics = moduleData.metrics.filter(metric => metric.label.toLowerCase().includes(filters.healthIdStatus));
            break;
          case 'doctors':
            if (filters.specialty) filteredData.details.specialties = moduleData.details.specialties.filter(spec => spec.name.toLowerCase() === filters.specialty);
            if (filters.status) filteredData.metrics = moduleData.metrics.filter(metric => metric.label.toLowerCase().includes(filters.status));
            if (filters.experience) filteredData.details.experience = moduleData.details.experience.filter(exp => exp.range === filters.experience);
            break;
          case 'pharmacies':
            if (filters.location) filteredData.distribution = moduleData.distribution.filter(item => item.label.toLowerCase().includes(filters.location));
            if (filters.status) filteredData.metrics = moduleData.metrics.filter(metric => metric.label.toLowerCase().includes(filters.status));
            if (filters.revenue) {
              const revenueThresholds = { high: 40000, medium: 20000, low: 0 };
              filteredData.details.inventory = moduleData.details.inventory.filter(item => item.value >= revenueThresholds[filters.revenue]);
            }
            break;
          case 'labs':
            if (filters.testType) filteredData.details.testTypes = moduleData.details.testTypes.filter(test => test.name.toLowerCase().includes(filters.testType));
            if (filters.location) filteredData.distribution = moduleData.distribution.filter(item => item.label.toLowerCase().includes(filters.location));
            if (filters.revenue) {
              const revenueThresholds = { high: 30000, medium: 15000, low: 0 };
              filteredData.details.testTypes = moduleData.details.testTypes.filter(test => test.revenue >= revenueThresholds[filters.revenue]);
            }
            break;
          case 'payments':
            if (filters.status) {
              filteredData.metrics = moduleData.metrics.filter(metric => metric.label.toLowerCase().includes(filters.status));
              filteredData.details.transactions = moduleData.details.transactions.filter(trans => trans.status.toLowerCase() === filters.status);
            }
            if (filters.method) {
              filteredData.distribution = moduleData.distribution.filter(item => item.label.toLowerCase().includes(filters.method));
              filteredData.details.transactions = moduleData.details.transactions.filter(trans => trans.method.toLowerCase() === filters.method);
            }
            break;
          case 'hospitals':
            if (filters.type) filteredData.distribution = moduleData.distribution.filter(item => item.label.toLowerCase() === filters.type);
            if (filters.status) filteredData.metrics = moduleData.metrics.filter(metric => metric.label.toLowerCase().includes(filters.status));
            if (filters.capacity) {
              const capacityRanges = { small: { min: 0, max: 100 }, medium: { min: 100, max: 500 }, large: { min: 500, max: Infinity } };
              const range = capacityRanges[filters.capacity];
              filteredData.details.departments = moduleData.details.departments.filter(dept => dept.count >= range.min && dept.count < range.max);
            }
            break;
        }
      }

      // Calculate totals and metrics based on time period
      const timePeriodMultipliers = { today: 1, week: 7, month: 30, quarter: 90, year: 365 };
      const multiplier = timePeriodMultipliers[timePeriod] || 1;

      if (filteredData.metrics && filteredData.metrics.length > 0) {
        filteredData.total = filteredData.metrics.reduce((sum, metric) => sum + metric.value, 0) * (multiplier / 7);
      }

      if (filteredData.details) {
        switch (selectedModule) {
          case 'hospitals':
            if (filteredData.details.departments) filteredData.revenue = filteredData.details.departments.reduce((sum, dept) => sum + dept.revenue, 0) * (multiplier / 7);
            break;
          case 'pharmacies':
            if (filteredData.details.inventory) filteredData.revenue = filteredData.details.inventory.reduce((sum, item) => sum + item.value, 0) * (multiplier / 7);
            break;
          case 'labs':
            if (filteredData.details.testTypes) filteredData.revenue = filteredData.details.testTypes.reduce((sum, test) => sum + test.revenue, 0) * (multiplier / 7);
            break;
          case 'payments':
            if (filteredData.details.transactions) filteredData.revenue = filteredData.details.transactions.reduce((sum, trans) => sum + trans.amount, 0) * (multiplier / 7);
            break;
        }
      }

      // Adjust trend data based on time period
      if (Array.isArray(filteredData.trend)) {
        const trendLength = filteredData.trend.length;
        const adjustedTrend = [];
        for (let i = 0; i < trendLength; i++) {
          adjustedTrend.push(filteredData.trend[i] * (multiplier / 7));
        }
        filteredData.trend = adjustedTrend;
      }

      const categoryData = {
        total: filteredData.total || 0,
        growth: filteredData.growth || 0,
        revenue: filteredData.revenue || 0,
        conversion: filteredData.conversion || 0,
        trend: Array.isArray(filteredData.trend) ? filteredData.trend : [],
        distribution: Array.isArray(filteredData.distribution) ? filteredData.distribution : [],
        metrics: Array.isArray(filteredData.metrics) ? filteredData.metrics : []
      };

      console.log('Processed Category Data:', JSON.stringify(categoryData, null, 2));

      if (!categoryData || typeof categoryData !== 'object') throw new Error('Invalid data structure received from API');
      const requiredFields = ['total', 'growth', 'revenue', 'conversion'];
      const missingFields = requiredFields.filter(field => !(field in categoryData));
      if (missingFields.length > 0) throw new Error(`Missing required fields: ${missingFields.join(', ')}`);

      setData(categoryData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const renderFilters = () => {
    const currentModuleFilters = moduleFilters[selectedModule];
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(currentModuleFilters).map(([filterKey, options]) => (
            <div key={filterKey} className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1">
                {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
              </label>
              <select
                value={filters[filterKey] || ''}
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabularView = () => {
    if (!data || !data.metrics) return null;

    const getDetailedColumns = () => {
      switch (selectedModule) {
        case 'hospitals':
          return [
            { header: 'Department', key: 'name' },
            { header: 'Count', key: 'count' },
            { header: 'Occupancy Rate', key: 'occupancy' },
            { header: 'Revenue', key: 'revenue' }
          ];
        case 'patients':
          return [
            { header: 'Age Group', key: 'range' },
            { header: 'Count', key: 'count' },
            { header: 'Percentage', key: 'percentage' },
            { header: 'Status', key: 'status' }
          ];
        case 'doctors':
          return [
            { header: 'Specialty', key: 'name' },
            { header: 'Count', key: 'count' },
            { header: 'Percentage', key: 'percentage' },
            { header: 'Experience', key: 'range' }
          ];
        case 'pharmacies':
          return [
            { header: 'Category', key: 'category' },
            { header: 'Count', key: 'count' },
            { header: 'Value', key: 'value' },
            { header: 'Revenue', key: 'revenue' }
          ];
        case 'labs':
          return [
            { header: 'Test Type', key: 'name' },
            { header: 'Count', key: 'count' },
            { header: 'Revenue', key: 'revenue' },
            { header: 'Turnaround', key: 'type' }
          ];
        case 'payments':
          return [
            { header: 'Method', key: 'method' },
            { header: 'Count', key: 'count' },
            { header: 'Amount', key: 'amount' },
            { header: 'Status', key: 'status' }
          ];
        default:
          return [
            { header: 'Metric', key: 'label' },
            { header: 'Value', key: 'value' }
          ];
      }
    };

    const getDetailedData = () => {
      switch (selectedModule) {
        case 'hospitals':
          return mockData.hospitals.details.departments;
        case 'patients':
          return mockData.patients.details.ageGroups;
        case 'doctors':
          return mockData.doctors.details.specialties;
        case 'pharmacies':
          return mockData.pharmacies.details.inventory;
        case 'labs':
          return mockData.labs.details.testTypes;
        case 'payments':
          return mockData.payments.details.transactions;
        default:
          return data.metrics;
      }
    };

    const columns = getDetailedColumns();
    const detailedData = getDetailedData();

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed View</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {detailedData.map((item, index) => (
                <tr key={index}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {column.key === 'revenue' || column.key === 'value' || column.key === 'amount'
                        ? `₹${Math.round(item[column.key]).toLocaleString('en-IN')}`
                        : column.key === 'percentage' || column.key === 'occupancy'
                        ? `${Math.round(item[column.key])}%`
                        : column.key === 'count'
                        ? Math.round(item[column.key]).toLocaleString('en-IN')
                        : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const exportData = (format) => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedModule}_report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data');
    }
  };

  const renderKPICard = (title, value, suffix = '') => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-blue-600">
        {loading ? '...' : suffix === '₹' ? 
          `₹${Math.round(value || 0).toLocaleString('en-IN')}` :
          suffix === '%' ? 
            `${Math.round(value || 0)}%` :
            Math.round(value || 0).toLocaleString('en-IN')
        }
      </p>
    </div>
  );

  const renderChart = (data, type) => {
    console.log('Chart Data:', data);
    console.log('Chart Type:', type);

    if (!data || data.length === 0) {
      console.log('No data available for chart');
      return (
        <div className="h-64 bg-white rounded-lg shadow p-4 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    if (type === 'trend') {
      console.log('Rendering trend chart with data:', data);
      const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Trend',
            data: data,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            tension: 0.4,
            fill: true
          }
        ]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Trend Over Time'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

      return (
        <div className="h-64 bg-white rounded-lg shadow p-4">
          <Line data={chartData} options={options} />
        </div>
      );
    }

    if (type === 'distribution') {
      console.log('Rendering distribution chart with data:', data);
      const chartData = {
        labels: data.map(item => item.label),
        datasets: [
          {
            data: data.map(item => item.value),
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }
        ]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Distribution'
          }
        }
      };

      return (
        <div className="h-64 bg-white rounded-lg shadow p-4">
          <Pie data={chartData} options={options} />
        </div>
      );
    }

    return null;
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="border rounded p-2"
          >
            <option value="patients">Patients</option>
            <option value="doctors">Doctors</option>
            <option value="pharmacies">Pharmacies</option>
            <option value="labs">Labs</option>
            <option value="payments">Payments</option>
            <option value="hospitals">Hospitals</option>
          </select>

          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="border rounded p-2"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <select
            value={displayFormat}
            onChange={(e) => setDisplayFormat(e.target.value)}
            className="border rounded p-2"
          >
            <option value="graph">Graph View</option>
            <option value="tabular">Tabular View</option>
            <option value="both">Both Views</option>
          </select>

          <button
            onClick={() => exportData(outputFormat)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export {outputFormat.toUpperCase()}
          </button>
        </div>
      </div>

      {renderFilters()}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {renderKPICard('Total', data?.total)}
        {renderKPICard('Growth', data?.growth, '%')}
        {renderKPICard('Revenue', data?.revenue, '$')}
        {renderKPICard('Conversion', data?.conversion, '%')}
      </div>

      {(displayFormat === 'graph' || displayFormat === 'both') && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {console.log('Rendering charts with data:', data)}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Trend Analysis</h3>
            {renderChart(data.trend, 'trend')}
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Distribution Analysis</h3>
            {renderChart(data.distribution, 'distribution')}
          </div>
        </div>
      )}

      {(displayFormat === 'tabular' || displayFormat === 'both') && renderTabularView()}

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data?.metrics?.map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded p-4">
              <h4 className="font-medium text-gray-700">{metric.label}</h4>
              <p className="text-xl font-bold text-blue-600">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;