INSERT INTO departments (name)
VALUES  ('R&D'),
        ('Marketing'),
        ('Regulatory'),
        ('Quality Assurance'),
        ('Operations');

INSERT INTO roles(title,salary, department_id)
VALUES  ('Associate', 60000.00, 3),
        ('Partner', 80000.00, 2),
        ('Manager', 100000.00, 4),
        ('Fellow', 150000.00, 1),
        ('Director', 175000.00, 5);

INSERT INTO employees(first_name,last_name, role_id, manager_id)
VALUES  ('John','Doe', 1, 1),
        ('Jane','Doe', 2, 2),
        ('Aoife','Ceallaigh', 3, 3),
        ('Mohammed','Avdol', 4, 4),
        ('Guillaume','Deschamps', 5, 5);