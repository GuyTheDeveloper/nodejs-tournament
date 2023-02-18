create extension if not exists "uuid-ossp";

create table admin (
    id uuid default uuid_generate_v4() primary key,
    admin_id int not null UNIQUE,
    name varchar not null
);

create table users (
    id uuid default uuid_generate_v4() primary key,
    username varchar not null,
    phone varchar not null,
    user_id int not null,
    status BOOLEAN default true
);

CREATE TABLE services(
    id uuid default uuid_generate_v4() primary key,
    title varchar(75) not null
);

create table masters(
    id uuid default uuid_generate_v4() primary key,
    name varchar(75) not null,
    phone varchar(13) not null,
    workshop_name varchar(100),
    address varchar(100),
    target varchar(100),
    location text not null,
    work_starts time not null,
    work_ends time not null,
    consume_show time not null,
    active boolean default true,
    service_id uuid,
    FOREIGN KEY(service_id)
    REFERENCES services(id)
    on delete CASCADE
);

INSERT INTO admin(admin_id, name) values(1772591765, 'AkmalDev');