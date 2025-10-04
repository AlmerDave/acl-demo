-- Sample data for LEGACY database (old system)
INSERT INTO legacy_customer (customer_id, full_name, email, phone_number, address, city, account_type, created_date) VALUES
('LEG001', 'John Doe', 'john.doe@oldbank.com', '555-0101', '123 Main St', 'New York', 'SAVINGS', '2020-01-15'),
('LEG002', 'Jane Smith', 'jane.smith@oldbank.com', '555-0102', '456 Oak Ave', 'Los Angeles', 'CHECKING', '2020-03-22'),
('LEG003', 'Bob Johnson', 'bob.j@oldbank.com', '555-0103', '789 Pine Rd', 'Chicago', 'SAVINGS', '2019-11-10'),
('LEG004', 'Alice Williams', 'alice.w@oldbank.com', '555-0104', '321 Elm St', 'Houston', 'PREMIUM', '2021-05-18'),
('LEG005', 'Charlie Brown', 'charlie.b@oldbank.com', '555-0105', '654 Maple Dr', 'Phoenix', 'CHECKING', '2020-08-30');

-- Sample data for NEW database (modern system)
-- Customers
INSERT INTO customer (id, name, account_type, created_at) VALUES
('NEW001', 'Emma Davis', 'SAVINGS', '2024-01-10 10:30:00'),
('NEW002', 'Michael Chen', 'PREMIUM', '2024-02-15 14:20:00'),
('NEW003', 'Sarah Martinez', 'CHECKING', '2024-03-20 09:45:00');

-- Addresses (REMOVED manual ID - let auto-increment handle it)
INSERT INTO address (customer_id, street, city, state, zip_code) VALUES
('NEW001', '999 Broadway', 'Seattle', 'WA', '98101'),
('NEW002', '777 Tech Blvd', 'San Francisco', 'CA', '94105'),
('NEW003', '888 Market St', 'Austin', 'TX', '78701');

-- Contacts (REMOVED manual ID - let auto-increment handle it)
INSERT INTO contact (customer_id, email, phone, preferred_contact) VALUES
('NEW001', 'emma.davis@newbank.com', '555-0201', 'EMAIL'),
('NEW002', 'michael.chen@newbank.com', '555-0202', 'PHONE'),
('NEW003', 'sarah.martinez@newbank.com', '555-0203', 'EMAIL');