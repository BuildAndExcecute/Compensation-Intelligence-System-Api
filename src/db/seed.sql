INSERT INTO companies (name, industry, website)
VALUES
('Google', 'Technology', 'https://google.com'),
('Microsoft', 'Technology', 'https://microsoft.com');

INSERT INTO roles (title)
VALUES
('Software Engineer'),
('Senior Software Engineer'),
('Staff Engineer'),
('Engineering Manager'),
('Data Scientist'),
('QA Engineer');

INSERT INTO locations (city, country)
VALUES
('Bangalore', 'India'),
('Hyderabad', 'India'),
('Pune', 'India');


INSERT INTO compensation_records
(company_id, role_id, location_id, base_salary, bonus, stock)
VALUES

-- Google
(1,1,1,1500000,200000,300000),
(1,1,1,1600000,250000,350000),
(1,1,2,1700000,300000,400000),

(1,2,1,2200000,400000,500000),
(1,2,2,2400000,450000,600000),
(1,2,3,2300000,400000,550000),

(1,3,1,3500000,500000,800000),
(1,3,2,3700000,600000,900000),
(1,3,3,3900000,700000,1000000),

(1,4,1,3000000,400000,700000),
(1,4,2,3200000,450000,750000),

(1,5,1,1800000,250000,350000),
(1,5,2,1900000,300000,400000),

(1,6,1,800000,100000,100000),
(1,6,2,900000,100000,150000),

-- Microsoft
(2,1,1,1700000,250000,400000),
(2,1,2,1800000,300000,450000),

(2,2,1,2500000,450000,600000),
(2,2,2,2600000,500000,650000),

(2,3,1,4000000,700000,1200000),
(2,3,2,4200000,800000,1300000),

(2,4,1,3400000,500000,800000),
(2,4,2,3500000,550000,900000),

(2,5,1,2000000,300000,500000),
(2,5,2,2100000,350000,550000),

(2,6,1,1000000,100000,150000),
(2,6,2,1100000,120000,180000);