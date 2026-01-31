--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.1

-- Started on 2026-01-31 22:47:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 869 (class 1247 OID 16874)
-- Name: account_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.account_type_enum AS ENUM (
    'savings',
    'checking',
    'credit_card',
    'loan',
    'investment'
);


ALTER TYPE public.account_type_enum OWNER TO postgres;

--
-- TOC entry 905 (class 1247 OID 17006)
-- Name: accounttype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.accounttype AS ENUM (
    'savings',
    'checking',
    'credit_card',
    'loan',
    'investment'
);


ALTER TYPE public.accounttype OWNER TO postgres;

--
-- TOC entry 893 (class 1247 OID 16965)
-- Name: alert_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.alert_type_enum AS ENUM (
    'low_balance',
    'bill_due',
    'budget_exceeded'
);


ALTER TYPE public.alert_type_enum OWNER TO postgres;

--
-- TOC entry 914 (class 1247 OID 17032)
-- Name: alerttype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.alerttype AS ENUM (
    'low_balance',
    'bill_due',
    'budget_exceeded'
);


ALTER TYPE public.alerttype OWNER TO postgres;

--
-- TOC entry 911 (class 1247 OID 17024)
-- Name: billstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.billstatus AS ENUM (
    'upcoming',
    'paid',
    'overdue'
);


ALTER TYPE public.billstatus OWNER TO postgres;

--
-- TOC entry 863 (class 1247 OID 16856)
-- Name: kyc_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kyc_status_enum AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE public.kyc_status_enum OWNER TO postgres;

--
-- TOC entry 902 (class 1247 OID 17000)
-- Name: kycstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kycstatus AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE public.kycstatus OWNER TO postgres;

--
-- TOC entry 884 (class 1247 OID 16930)
-- Name: status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_enum AS ENUM (
    'upcoming',
    'paid',
    'overdue'
);


ALTER TYPE public.status_enum OWNER TO postgres;

--
-- TOC entry 875 (class 1247 OID 16899)
-- Name: txn_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.txn_type_enum AS ENUM (
    'debit',
    'credit'
);


ALTER TYPE public.txn_type_enum OWNER TO postgres;

--
-- TOC entry 908 (class 1247 OID 17018)
-- Name: txntype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.txntype AS ENUM (
    'debit',
    'credit'
);


ALTER TYPE public.txntype OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16886)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    account_id integer NOT NULL,
    user_id integer,
    bank_name character varying(255),
    account_type public.account_type_enum DEFAULT 'savings'::public.account_type_enum NOT NULL,
    masked_account character varying(200),
    currency character varying(3),
    balance numeric(12,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16885)
-- Name: accounts_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.accounts ALTER COLUMN account_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.accounts_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 232 (class 1259 OID 16986)
-- Name: adminlogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adminlogs (
    log_id integer NOT NULL,
    admin_id integer,
    action text,
    target_type character varying(255),
    target_id integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.adminlogs OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16985)
-- Name: adminlogs_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.adminlogs ALTER COLUMN log_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.adminlogs_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 16972)
-- Name: alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerts (
    alert_id integer NOT NULL,
    user_id integer,
    type public.alert_type_enum,
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.alerts OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16971)
-- Name: alerts_alert_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.alerts ALTER COLUMN alert_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.alerts_alert_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 16938)
-- Name: bills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bills (
    bill_id integer NOT NULL,
    user_id integer,
    biller_name character varying(255),
    due_date date DEFAULT (CURRENT_DATE + '15 days'::interval) NOT NULL,
    amount_due numeric(12,2),
    status public.status_enum DEFAULT 'upcoming'::public.status_enum NOT NULL,
    auto_pay boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.bills OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16937)
-- Name: bills_bill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.bills ALTER COLUMN bill_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bills_bill_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 16918)
-- Name: budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budgets (
    budget_id integer NOT NULL,
    user_id integer,
    month integer,
    year integer,
    category character varying(200),
    limit_amount numeric(12,2),
    spent_amount numeric(12,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.budgets OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16917)
-- Name: budgets_budget_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.budgets ALTER COLUMN budget_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.budgets_budget_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 234 (class 1259 OID 17040)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer,
    token character varying,
    is_revoked boolean,
    created_at timestamp without time zone,
    expires_at timestamp without time zone
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17039)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 233
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- TOC entry 228 (class 1259 OID 16953)
-- Name: rewards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rewards (
    reward_id integer NOT NULL,
    user_id integer,
    program_name character varying(255),
    points_balance integer,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.rewards OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16952)
-- Name: rewards_reward_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rewards ALTER COLUMN reward_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rewards_reward_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16904)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    trans_id integer NOT NULL,
    account_id integer,
    description character varying(255),
    category character varying(255),
    amount numeric(12,2),
    currency character varying(3),
    txn_type public.txn_type_enum,
    merchant character varying(255),
    txn_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16903)
-- Name: transactions_trans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.transactions ALTER COLUMN trans_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.transactions_trans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 16862)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(50),
    kyc_status public.kyc_status_enum DEFAULT 'unverified'::public.kyc_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16861)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4724 (class 2604 OID 17043)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4903 (class 0 OID 16886)
-- Dependencies: 220
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (account_id, user_id, bank_name, account_type, masked_account, currency, balance, created_at) FROM stdin;
3	1	ICICI Bank	savings	1234-5678-9000001	INR	32000.00	2026-01-28 16:39:05.815465
4	1	HDFC Bank	savings	123-456-900002	INR	35000.00	2026-01-28 16:46:21.986434
7	1	HDFC Bank	savings	XXXX-XXXX-1234	INR	50000.00	2026-01-29 21:42:22.412314
\.


--
-- TOC entry 4915 (class 0 OID 16986)
-- Dependencies: 232
-- Data for Name: adminlogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adminlogs (log_id, admin_id, action, target_type, target_id, "timestamp") FROM stdin;
1	1	Manual verification completed	user	1	2026-01-29 21:42:22.412314
\.


--
-- TOC entry 4913 (class 0 OID 16972)
-- Dependencies: 230
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerts (alert_id, user_id, type, message, created_at) FROM stdin;
3	1	budget_exceeded	You have exceeded your Food budget for this month.	2026-01-29 21:42:22.412314
4	1	low_balance	Your account balance is below ₹1,000.	2026-01-29 21:42:22.412314
\.


--
-- TOC entry 4909 (class 0 OID 16938)
-- Dependencies: 226
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bills (bill_id, user_id, biller_name, due_date, amount_due, status, auto_pay, created_at) FROM stdin;
3	1	Electricity Board	2026-02-03	1800.00	upcoming	f	2026-01-29 21:42:22.412314
4	1	Mobile Recharge	2026-01-27	599.00	overdue	t	2026-01-29 21:42:22.412314
\.


--
-- TOC entry 4907 (class 0 OID 16918)
-- Dependencies: 224
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budgets (budget_id, user_id, month, year, category, limit_amount, spent_amount, created_at) FROM stdin;
2	1	1	2026	Food	8000.00	1200.00	2026-01-29 21:42:22.412314
\.


--
-- TOC entry 4917 (class 0 OID 17040)
-- Dependencies: 234
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, user_id, token, is_revoked, created_at, expires_at) FROM stdin;
1	1	sample_refresh_token_123456	f	2026-01-29 21:42:22.412314	2026-02-05 21:42:22.412314
\.


--
-- TOC entry 4911 (class 0 OID 16953)
-- Dependencies: 228
-- Data for Name: rewards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rewards (reward_id, user_id, program_name, points_balance, last_updated) FROM stdin;
2	1	HDFC Credit Card Rewards	1250	2026-01-29 21:42:22.412314
\.


--
-- TOC entry 4905 (class 0 OID 16904)
-- Dependencies: 222
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (trans_id, account_id, description, category, amount, currency, txn_type, merchant, txn_date) FROM stdin;
5	3	Grocery shopping	Food	1200.00	INR	debit	Reliance Smart	2026-01-26 21:42:22.412314
6	3	Monthly Salary	Income	75000.00	INR	credit	ABC Technologies Pvt Ltd	2026-01-19 21:42:22.412314
\.


--
-- TOC entry 4901 (class 0 OID 16862)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, phone, kyc_status, created_at) FROM stdin;
1	Shivani	Shivani.Srivastava@gmail.com	Shivani1234@	9876543217	unverified	2026-01-28 21:55:36.180765
4	Vansh Garg	vansh@gmail.com	hashed_password_123	9876543210	verified	2026-01-29 21:42:22.412314
\.


--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 219
-- Name: accounts_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accounts_account_id_seq', 7, true);


--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 231
-- Name: adminlogs_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adminlogs_log_id_seq', 1, true);


--
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 229
-- Name: alerts_alert_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alerts_alert_id_seq', 4, true);


--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 225
-- Name: bills_bill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bills_bill_id_seq', 4, true);


--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 223
-- Name: budgets_budget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budgets_budget_id_seq', 2, true);


--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 233
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 1, true);


--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 227
-- Name: rewards_reward_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rewards_reward_id_seq', 2, true);


--
-- TOC entry 4931 (class 0 OID 0)
-- Dependencies: 221
-- Name: transactions_trans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_trans_id_seq', 6, true);


--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4730 (class 2606 OID 16892)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (account_id);


--
-- TOC entry 4742 (class 2606 OID 16993)
-- Name: adminlogs adminlogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminlogs
    ADD CONSTRAINT adminlogs_pkey PRIMARY KEY (log_id);


--
-- TOC entry 4740 (class 2606 OID 16979)
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (alert_id);


--
-- TOC entry 4736 (class 2606 OID 16946)
-- Name: bills bills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (bill_id);


--
-- TOC entry 4734 (class 2606 OID 16923)
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (budget_id);


--
-- TOC entry 4746 (class 2606 OID 17047)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4738 (class 2606 OID 16958)
-- Name: rewards rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_pkey PRIMARY KEY (reward_id);


--
-- TOC entry 4732 (class 2606 OID 16911)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (trans_id);


--
-- TOC entry 4726 (class 2606 OID 16872)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4728 (class 2606 OID 16870)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4743 (class 1259 OID 17053)
-- Name: ix_refresh_tokens_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_refresh_tokens_token ON public.refresh_tokens USING btree (token);


--
-- TOC entry 4744 (class 1259 OID 17054)
-- Name: ix_refresh_tokens_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_refresh_tokens_user_id ON public.refresh_tokens USING btree (user_id);


--
-- TOC entry 4748 (class 2606 OID 16912)
-- Name: transactions fk_account_trans; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk_account_trans FOREIGN KEY (account_id) REFERENCES public.accounts(account_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4752 (class 2606 OID 16980)
-- Name: alerts fk_alerts_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT fk_alerts_users FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4753 (class 2606 OID 16994)
-- Name: adminlogs fk_logs_admin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminlogs
    ADD CONSTRAINT fk_logs_admin FOREIGN KEY (admin_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4751 (class 2606 OID 16959)
-- Name: rewards fk_rewards_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT fk_rewards_users FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4747 (class 2606 OID 16893)
-- Name: accounts fk_users_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT fk_users_account FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4750 (class 2606 OID 16947)
-- Name: bills fk_users_bills; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT fk_users_bills FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4749 (class 2606 OID 16924)
-- Name: budgets fk_users_budgets; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT fk_users_budgets FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4754 (class 2606 OID 17048)
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-01-31 22:47:36

--
-- PostgreSQL database dump complete
--

