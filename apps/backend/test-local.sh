#!/bin/bash

# Test Local Backend Configuration
# This script validates the backend setup before Vercel deployment

set -e

echo "🧪 Testing Tickrify Backend Configuration"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from the apps/backend directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Check Node.js version
echo "🔍 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Node version: $NODE_VERSION"
if [[ "$NODE_VERSION" < "v18" ]]; then
    echo -e "${RED}❌ Node.js version must be >= 18${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version OK${NC}"
echo ""

# Check if node_modules exists
echo "🔍 Checking node_modules..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found, installing...${NC}"
    npm install
else
    echo -e "${GREEN}✅ node_modules exists${NC}"
fi
echo ""

# Check environment variables
echo "🔍 Checking environment variables..."
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Please create .env file with required variables"
    echo "See ENV_VARIABLES.md for details"
    exit 1
fi

# Check critical environment variables
REQUIRED_VARS=(
    "DATABASE_URL"
    "CLERK_SECRET_KEY"
    "OPENAI_API_KEY"
    "STRIPE_SECRET_KEY"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^$var=" "$ENV_FILE" 2>/dev/null || [ -z "$(grep "^$var=" "$ENV_FILE" | cut -d'=' -f2)" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    printf '%s\n' "${MISSING_VARS[@]}"
    echo "Please add them to .env file"
    echo "See ENV_VARIABLES.md for details"
    exit 1
fi
echo -e "${GREEN}✅ Required environment variables present${NC}"
echo ""

# Check Prisma
echo "🔍 Checking Prisma setup..."
if [ ! -f "prisma/schema.prisma" ]; then
    echo -e "${RED}❌ prisma/schema.prisma not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Prisma schema found${NC}"

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma client${NC}"
    exit 1
fi
echo ""

# Test Prisma connection
echo "🔍 Testing database connection..."
npx prisma db pull --force > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${YELLOW}⚠️  Database connection failed${NC}"
    echo "   This might be okay if database is not set up yet"
fi
echo ""

# Build project
echo "🏗️  Building project..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    echo "Run 'npm run build' to see detailed errors"
    exit 1
fi
echo ""

# Check if main.js and vercel.js exist
echo "🔍 Checking build outputs..."
if [ ! -f "dist/src/main.js" ]; then
    echo -e "${RED}❌ dist/src/main.js not found${NC}"
    exit 1
fi
if [ ! -f "dist/src/vercel.js" ]; then
    echo -e "${RED}❌ dist/src/vercel.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build outputs present${NC}"
echo ""

# Check vercel.json
echo "🔍 Checking vercel.json..."
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ vercel.json not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ vercel.json found${NC}"
echo ""

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}✅ All checks passed!${NC}"
echo "=========================================="
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Start local server:"
echo "   npm run dev"
echo ""
echo "2. Test the server:"
echo "   curl http://localhost:3001/health"
echo ""
echo "3. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "📖 For more information:"
echo "   - ENV_VARIABLES.md"
echo "   - VERCEL_DEPLOY.md"
echo "   - README_VERCEL.md"
echo ""

