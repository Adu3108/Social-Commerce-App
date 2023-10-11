create table user_base
    (
        ID            varchar(5),
        name          varchar(20) not null,
        primary key (ID)
    );

create table seller
    (
        ID            varchar(5),
        username      varchar(20) not null,
        address       varchar(100),
        email         varchar(50),
        primary key (ID),
        foreign key (ID) references user_base
    );

create table buyer
    (
        ID            varchar(5),
        username      varchar(20) not null,
        address       varchar(100),
        email         varchar(50),
        primary key (ID),
        foreign key (ID) references user_base
    );

create table sale
    (
        ID varchar(10),
        name varchar(20),
        price numeric(5,0) check (price >= 0),
        dimensions varchar(10),
        type varchar(20),
        quantity numeric(3,0) check (quantity >= 0),
        status varchar(10) check (status in ('ACTIVE', 'SOLD', 'FAIL')),
        seller_id varchar(5),
        description varchar(100),
        image varchar(50),
        primary key (ID),
        foreign key (seller_id) references seller
        on delete set null
    );

create table transaction
    (
        transaction_id varchar(10),
        buyer_id varchar(5),
        seller_id varchar(5),
        sale_id varchar(10),
        transaction_status varchar(7) check (transaction_status in ('OK', 'PENDING', 'FAIL')),
        quantity numeric(3,0) check (quantity >= 0),
        delivery_date DATE,
        primary key (transaction_id),
        foreign key (sale_id) references sale,
        foreign key (buyer_id) references buyer,
        foreign key (seller_id) references seller
    );

create table review
    (
        ID varchar(10),
        sale_id varchar(10),
        seller_id varchar(5),
        buyer_id varchar(5),
        comment varchar(100),
        transaction_id varchar(10),
        stars numeric(1,0) check (stars >=0 and stars <=5),
        primary key (ID),
        foreign key (sale_id) references sale,
        foreign key (transaction_id) references transaction,
        foreign key (seller_id) references seller,
        foreign key (buyer_id) references buyer
    );

create table user_password
    (ID   	 varchar(5),
     hashed_password    varchar(80)  
    );
