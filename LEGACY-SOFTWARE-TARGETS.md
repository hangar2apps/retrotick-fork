# Legacy Software Testing Targets
*For RetroTick business validation - March 3, 2026*

## 🎯 High-Priority Business Software

### **Accounting Software**
1. **QuickBooks Pro 2000-2005**
   - Still used by many small businesses
   - Critical data, hard to migrate
   - Find via: archive.org, old software sites
   - Test complexity: File I/O, printing, database

2. **Peachtree Accounting (Sage 50)**
   - Popular in 90s/early 2000s
   - Many businesses never upgraded
   - Essential for payroll, tax reporting
   - Test: Core accounting functions

3. **Simply Accounting 6.0-8.0**
   - Canadian small business standard
   - Simple interface, basic functions
   - Good initial compatibility target

### **Point-of-Sale (POS) Systems**
1. **Retail Pro 7.x-8.x**
   - Dominant retail POS in late 90s
   - Inventory management critical
   - Test: Transaction processing, inventory

2. **Microsoft Retail Management System**
   - Small to medium retail stores
   - Basic POS functionality
   - Should have good Win32 API usage

3. **Cash Register Express**
   - Simple, widely-used POS
   - Good starter test case
   - Find via: software archives

### **Inventory Management**
1. **Fishbowl Inventory (early versions)**
   - Manufacturing/warehouse focus
   - Complex database operations
   - Test: Multi-user features

2. **Inflow Inventory 2.x**
   - Small business inventory
   - File-based storage
   - Good compatibility target

## 🔍 Where to Find Test Software

### **Legal Sources:**
- **Archive.org Software Library**
  - Abandonware section
  - Educational/demo versions
  - Public domain releases

- **Vendor Demo/Trial Versions**
  - Old trial software still downloadable
  - Feature-limited but functional
  - Legal to use for testing

- **Academic Sources**
  - University software archives
  - Computer history preservation
  - Educational versions

### **Search Terms:**
- "legacy accounting software download"
- "old pos system software archive"  
- "vintage business software demo"
- "retro inventory management program"

## 📊 Testing Methodology

### **Phase 1: Startup Test**
- Does it load without crashing?
- Main window appears?
- Menus functional?
- Dialog boxes work?

### **Phase 2: Core Functions**
- Can create new records?
- Data entry forms work?
- File operations succeed?
- Printing functions (stub test)?

### **Phase 3: Business Logic**
- Calculations work correctly?
- Reports generate?
- Database operations?
- Multi-window management?

### **Success Criteria:**
- ✅ **Basic:** Starts, shows main interface
- ✅ **Functional:** Core business operations work
- ✅ **Usable:** Real workflow completion possible
- ✅ **Stable:** No crashes during normal use

## 🚨 Red Flags to Avoid

### **Don't Test:**
- **Modern software** (post-2010) - not the target market
- **Games** - copyright issues, different compatibility needs
- **System utilities** - too low-level, niche market
- **Development tools** - wrong target audience

### **Legal Caution:**
- Only use demo/trial/abandonware versions
- Don't redistribute copyrighted software
- Focus on proving compatibility, not providing content
- Document all software sources

## 💰 Market Validation Questions

For each working software category:

1. **How many businesses still use this?**
2. **What's their pain migrating to modern alternatives?**
3. **Would they pay $50-500/month for cloud access?**
4. **What complementary services would they need?** (data migration, training, support)

## 📈 Success Metrics

- **Software loads:** Basic compatibility score
- **Core functions work:** Usability assessment  
- **No crashes:** Stability rating
- **Business workflow complete:** Market viability

---
*Target: Find 3-5 working business applications to validate B2B market demand*