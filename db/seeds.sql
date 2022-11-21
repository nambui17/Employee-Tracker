INSERT INTO departments (name)
VALUES  ('R&D'),
        ('Marketing'),
        ('Regulatory'),
        ('Quality Assurance'),
        ('Operations');

INSERT INTO roles(title,salary, department_id)
VALUES  ('Associate Scientist', 60000.00, 1),
        ('Senior Scientist', 80000.00, 4),
        ('Fellow', 150000.00, 1),
        ('Partner', 80000.00, 2),
        ('Manager', 100000.00, 5);

INSERT INTO employees(first_name,last_name, role_id, manager_id)
VALUES  ('Aoife','Ceallaigh', 5, NULL),
        ('Mohammed','Avdol', 5, NULL),
        ('Guillaume','Deschamps', 1, 1),
        ('Tim', 'Horton', 1, 2),
        ('John','Doe', 1, 1),
        ('Jane','Doe', 1, 2);