# 🏦 Anti-Corruption Layer Pattern: A Real-World Database Migration Solution

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen?logo=springboot)
![Java](https://img.shields.io/badge/Java-17-orange?logo=java)
![Thymeleaf](https://img.shields.io/badge/Thymeleaf-3.1-blue?logo=thymeleaf)
![H2 Database](https://img.shields.io/badge/H2-In--Memory-blue?logo=database)
![License](https://img.shields.io/badge/license-MIT-green)

**A live, interactive demonstration of the Anti-Corruption Layer (ACL) pattern solving real-world database migration challenges in banking systems.**

[Live Demo](https://acl-demo.onrender.com) • [Documentation](#-live-demo-features)

</div>

## 🔥 The Problem

Imagine you're working at a bank with a **10-year-old legacy system**. Your database looks like this:

### Legacy Database (The Old Way)
```
LEGACY_CUSTOMER Table
┌─────────────┬───────────────┬──────────────────────┬──────────────┬──────────────┬───────────┬──────────────┐
│ customer_id │ full_name     │ email                │ phone_number │ address      │ city      │ account_type │
├─────────────┼───────────────┼──────────────────────┼──────────────┼──────────────┼───────────┼──────────────┤
│ LEG001      │ John Doe      │ john.doe@bank.com    │ 555-0101     │ 123 Main St  │ New York  │ SAVINGS      │
│ LEG002      │ Jane Smith    │ jane.smith@bank.com  │ 555-0102     │ 456 Oak Ave  │ LA        │ CHECKING     │
└─────────────┴───────────────┴──────────────────────┴──────────────┴──────────────┴───────────┴──────────────┘
```

**Problems with this approach:**
- ❌ **Denormalized** - Everything crammed into one table
- ❌ **Data duplication** - Same city/state repeated for every customer
- ❌ **Hard to scale** - Can't add new contact methods easily
- ❌ **Maintenance nightmare** - Any change affects all columns

---

### Modern Database (The New Way)

Your team wants to migrate to a **clean, normalized structure**:

```
CUSTOMER Table                    ADDRESS Table                   CONTACT Table
┌──────┬────────┐                ┌──────┬─────────────┐          ┌──────┬─────────────────┐
│ id   │ name   │                │ id   │ customer_id │          │ id   │ customer_id     │
├──────┼────────┤                ├──────┼─────────────┤          ├──────┼─────────────────┤
│ NEW1 │ Emma   │ ──────────────>│ 1    │ NEW1        │<─────────│ 1    │ NEW1            │
│ NEW2 │ Mike   │                │ 2    │ NEW2        │          │ 2    │ NEW2            │
└──────┴────────┘                └──────┴─────────────┘          └──────┴─────────────────┘
                                  │ street    │ city  │          │ email        │ phone   │
                                  ├───────────┼───────┤          ├──────────────┼─────────┤
                                  │ 999 Broad │ SEA   │          │ emma@bank... │ 555-... │
                                  └───────────┴───────┘          └──────────────┴─────────┘
```

**Benefits:**
- ✅ **Normalized** - Clean separation of concerns
- ✅ **Scalable** - Easy to add new fields
- ✅ **Maintainable** - Changes are isolated
- ✅ **Efficient** - No data duplication

---

### 🚨 The Challenge

**But here's the catch:**

You have **20+ microservices** still using the old database. You can't just:
- ❌ Shut down the system for migration (banks operate 24/7)
- ❌ Update all 20 microservices at once (too risky)
- ❌ Break existing business logic (regulations, compliance)
- ❌ Lose any customer data (legal requirements)

**What do you do?** 🤔

---

## 💡 The Solution: Anti-Corruption Layer

Enter the **Anti-Corruption Layer (ACL) Pattern** - a translation layer that sits between your old and new systems, allowing them to coexist peacefully during migration.

### What is ACL?

Think of the ACL as a **skilled translator** at the United Nations:
- **New Services** speak "Modern Database Language" (normalized)
- **Legacy Services** speak "Old Database Language" (flat structure)
- 🌐 **ACL** translates between them seamlessly

### How ACL Solves Our Problem

The ACL provides **two critical capabilities**:

#### 1️⃣ **Smart Read (Query with Fallback)**
```
User Request: "Get customer LEG001"
    │
    ▼
┌─────────────────────────────┐
│   Anti-Corruption Layer     │
│                             │
│  Step 1: Check NEW DB       │
│  ❌ Not found               │
│                             │
│  Step 2: Check LEGACY DB    │
│  ✅ Found!                  │
│                             │
│  Step 3: Transform          │
│  Legacy → Modern format     │
└─────────────────────────────┘
    │
    ▼
Return: Modern format data (even from legacy!)
```

#### 2️⃣ **Dual Write (Save Everywhere)**
```
User Request: "Create new customer"
    │
    ▼
┌─────────────────────────────┐
│   Anti-Corruption Layer     │
│                             │
│  Step 1: Save to NEW DB     │
│  ✅ Saved (normalized)      │
│                             │
│  Step 2: Transform          │
│  Modern → Legacy format     │
│                             │
│  Step 3: Save to LEGACY DB  │
│  ✅ Saved (flat)            │
└─────────────────────────────┘
    │
    ▼
Success: Data exists in BOTH databases!
```

---

## 🎯 Why This Matters

### Real-World Impact

1. **Zero Downtime Migration** ⏱️
   - Bank continues operating normally
   - Customers don't notice anything
   - No "maintenance windows" needed

2. **Risk Mitigation** 🛡️
   - Old services keep working with legacy DB
   - New services use modern DB
   - Easy rollback if issues occur

3. **Gradual Migration** 🚶‍♂️
   - Migrate one microservice at a time
   - Test thoroughly at each step
   - No "big bang" deployment

4. **Business Continuity** 💼
   - Compliance requirements met
   - No data loss
   - Audit trails maintained

---

## 🎨 Live Demo Features

**Live URL:** [https://acl-demo.onrender.com](https://acl-demo-xxxx.onrender.comhttps://acl-demo.onrender.com)

No installation needed - try it directly in your browser!

This interactive demo lets you **experience the ACL pattern in action**:

### 🔍 Smart Query Demonstration
- Search for customers by ID
- Watch the system try NEW database first
- See automatic fallback to LEGACY database
- View real-time transformation of old → new format
- Visual flow indicators show each step

### ✍️ Dual-Write Demonstration  
- Create new customers with auto-fill
- Witness simultaneous writes to both databases
- See model transformation in action
- Real-time success confirmation

### 📊 Migration Dashboard
- Live statistics of both databases
- Migration percentage tracker
- System status monitoring
- Record count comparison

### 📝 Activity Log
- Real-time operation tracking
- Database source identification
- Timestamp for each action
- Color-coded status indicators

### 📚 Documentation Page
- Pattern explanation
- Architecture diagrams
- Use case scenarios
- Benefits breakdown

---

## 🛠️ How It Works

### The User Journey

#### Scenario 1: Searching for a Legacy Customer

```
1. User enters "LEG001" in search box
   ↓
2. ACL checks NEW database
   → Customer not found (expected - it's old data)
   ↓
3. ACL falls back to LEGACY database  
   → Customer found! ✅
   ↓
4. ACL transforms flat structure to normalized format
   ↓
5. User sees data in modern format (regardless of source)
```

**Visual on Website:**
- ✅ Step 1: Check New DB... ❌ Not found
- ✅ Step 2: Check Legacy DB... ✅ Found!
- ✅ Step 3: Transform to new format... ✅ Done

#### Scenario 2: Creating a New Customer

```
1. User fills form (or clicks Auto-Fill)
   ↓
2. ACL receives modern data structure
   ↓
3. ACL saves to NEW database (normalized)
   → Customer, Address, Contact tables
   ↓
4. ACL transforms to legacy flat format
   ↓
5. ACL saves to LEGACY database (flat)
   → Single table with all fields
   ↓
6. Confirmation: "Saved in BOTH databases!"
```

**Visual on Website:**
- ✅ Written to NEW DB (normalized)
- ✅ Written to LEGACY DB (flattened for legacy services)

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│                      (Thymeleaf + JS)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Search     │  │   Create     │  │    Stats     │      │
│  │   Customer   │  │   Customer   │  │   Dashboard  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              ANTI-CORRUPTION LAYER (ACL)                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          AntiCorruptionLayer Service                 │   │
│  │                                                       │   │
│  │  • Smart Read Logic (Try New → Fallback to Old)     │   │
│  │  • Dual Write Logic (Save to Both)                  │   │
│  │  • Data Transformation (Old ↔ New)                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────┐              ┌─────────────────┐      │
│  │  Old DB Adapter │              │  New DB Adapter │      │
│  └─────────────────┘              └─────────────────┘      │
└────────┬──────────────────────────────────────┬─────────────┘
         │                                       │
         ▼                                       ▼
┌──────────────────┐                    ┌──────────────────┐
│  LEGACY DATABASE │                    │  MODERN DATABASE │
│                  │                    │                  │
│  ┌─────────────┐ │                    │  ┌────────────┐ │
│  │   LEGACY_   │ │                    │  │  CUSTOMER  │ │
│  │  CUSTOMER   │ │                    │  └────────────┘ │
│  │             │ │                    │  ┌────────────┐ │
│  │ • Flat      │ │                    │  │  ADDRESS   │ │
│  │ • All-in-   │ │                    │  └────────────┘ │
│  │   one       │ │                    │  ┌────────────┐ │
│  │ • Legacy    │ │                    │  │  CONTACT   │ │
│  │   format    │ │                    │  └────────────┘ │
│  └─────────────┘ │                    │                  │
│                  │                    │ • Normalized    │
│  H2 In-Memory    │                    │ • Relational    │
└──────────────────┘                    └──────────────────┘
```

### Data Flow

#### Read Operation (GET /api/customer/{id})
```
1. HTTP Request → CustomerController
2. Controller → AntiCorruptionLayer.getCustomer()
3. ACL → NewDatabaseAdapter.findById()
   ├─ If found → Transform → Return
   └─ If NOT found → OldDatabaseAdapter.findById()
      ├─ If found → Transform legacy → Return  
      └─ If NOT found → Throw Exception
4. Response → User Interface
```

#### Write Operation (POST /api/customer)
```
1. HTTP Request → CustomerController
2. Controller → AntiCorruptionLayer.createCustomer()
3. ACL → Transform DTO to Modern Model
4. ACL → NewDatabaseAdapter.save()  ✅ 
5. ACL → Transform Modern to Legacy Model
6. ACL → OldDatabaseAdapter.save()  ✅
7. Response → "Saved in BOTH databases"
```

---

## 🔧 Tech Stack

### Backend
- **Spring Boot 3.5.6** - Application framework
- **Spring Data JPA** - Database access
- **Hibernate** - ORM
- **H2 Database** - In-memory database (for demo)
- **Lombok** - Reduce boilerplate code
- **Jakarta Validation** - Input validation

### Frontend
- **Thymeleaf** - Server-side template engine
- **Bootstrap 5.3** - UI framework
- **Bootstrap Icons** - Icon library
- **Vanilla JavaScript** - Client-side interactions
- **Chart.js** - Data visualization (stats)

### Architecture Patterns
- **Anti-Corruption Layer (ACL)** - Core pattern
- **Adapter Pattern** - Database adapters
- **Transformer Pattern** - Data conversion
- **DTO Pattern** - Data transfer
- **Repository Pattern** - Data access

---

## 🚀 Notes

### Access H2 Console

```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:acldb
Username: sa
Password: (leave empty)
```

---

## 📡 API Documentation

### Get Customer
```http
GET /api/customer/{id}
```

**Response:**
```json
{
  "id": "LEG001",
  "name": "John Doe",
  "email": "john.doe@oldbank.com",
  "phone": "555-0101",
  "street": "123 Main St",
  "city": "New York",
  "source": "LEGACY_DB",
  "message": null
}
```

### Create Customer
```http
POST /api/customer
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@bank.com",
  "phone": "555-1234",
  "street": "789 Pine Rd",
  "city": "Seattle",
  "state": "WA",
  "zipCode": "98101",
  "accountType": "SAVINGS"
}
```

**Response:**
```json
{
  "id": "NEW7F4A2B",
  "name": "Jane Smith",
  "email": "jane@bank.com",
  "source": "DUAL_WRITE",
  "message": "Successfully created in both NEW and LEGACY databases"
}
```

### Get Migration Stats
```http
GET /api/customer/stats
```

**Response:**
```json
{
  "legacyRecords": 5,
  "modernRecords": 3,
  "totalRecords": 8,
  "migrationPercentage": 37.5,
  "status": "IN_PROGRESS"
}
```
## 🎓 Key Learnings

### When to Use ACL Pattern

✅ **Good Use Cases:**
- Migrating from legacy to modern systems
- Integrating with third-party systems
- Maintaining backward compatibility
- Gradual system modernization
- Multi-tenant systems with different models

❌ **Not Ideal For:**
- Greenfield projects (no legacy)
- Simple CRUD applications
- Systems with identical models
- Real-time, high-performance requirements (adds latency)

---

## 🌟 Notable Features

### Auto-Fill for Testing
- Click "Auto Fill" to generate random customer data
- Instantly populate all form fields
- Perfect for quick testing and demos

### Real-Time Logs
- See every operation as it happens
- Color-coded for success/error/info
- Timestamp for audit trail

### Visual Query Flow
- Step-by-step visualization
- Shows which database was hit
- Highlights transformation process

### Sample Data Included
- 5 Legacy customers (LEG001-LEG005)
- 3 Modern customers (NEW001-NEW003)
- Ready to explore immediately

---

## 🔍 Sample IDs to Try

### Legacy Database (Old System)
```
LEG001 - John Doe
LEG002 - Jane Smith  
LEG003 - Bob Johnson
LEG004 - Alice Williams
LEG005 - Charlie Brown
```

### Modern Database (New System)
```
NEW001 - Emma Davis
NEW002 - Michael Chen
NEW003 - Sarah Martinez
```

---

## 📊 Migration Metrics

Track your migration progress in real-time:

- **Legacy Records**: Count of old system records
- **Modern Records**: Count of new system records
- **Migration %**: Percentage of data migrated
- **Status**: STARTED → IN_PROGRESS → COMPLETED

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Almer Dave Dizon** - [@almerdavedizon](https://github.com/almerdavedizon)

Project Link: [https://github.com/almerdavedizon/acl-demo](https://github.com/almerdavedizon/acl-demo)

Live Demo: [https://acl-demo.onrender.com](https://acl-demo.onrender.com)

---

## 🙏 Acknowledgments

- Martin Fowler's [Anti-Corruption Layer Pattern](https://martinfowler.com/bliki/AnticorruptionLayer.html)
- Domain-Driven Design by Eric Evans
- Spring Boot Documentation
- Bootstrap Team

---

## 📚 Further Reading

- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [Microservices Patterns](https://microservices.io/patterns/index.html)
- [Spring Boot Best Practices](https://spring.io/guides)
- [Database Migration Strategies](https://www.martinfowler.com/articles/evodb.html)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ for developers facing legacy system challenges

</div>

---