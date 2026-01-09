# Eurodib Frontend Application

Next.js frontend application for Eurodib with Strapi CMS integration, multi-language support (en-CA, en-US, fr-CA), and full e-commerce functionality.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (package manager)
- Strapi backend running (local or cloud)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your Strapi URL
STRAPI_URL=http://localhost:1337
# or for Strapi Cloud:
# STRAPI_URL=https://your-strapi-cloud-url.com
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
eurodib-frontend/
├── components/          # React components
│   ├── layout/         # Header, Footer, MainLayout
│   ├── account/        # Account-related components
│   └── ...
├── lib/
│   ├── api/            # Strapi API integration
│   ├── utils/          # Utilities (cart, locale, translations)
│   └── types/          # TypeScript types
├── pages/              # Next.js pages (file-based routing)
├── public/             # Static assets (CSS, JS, images)
└── styles/             # Global styles
```

## 🌍 Multi-Language Support

The application supports three locales:
- `en-CA` (English - Canada) - Default
- `en-US` (English - United States)
- `fr-CA` (French - Canada)

Language switching is handled via:
- URL query parameter: `?locale=fr-CA`
- Cookie storage
- Browser language detection

## 🔗 Strapi Integration

### Connecting to Strapi Cloud

1. Get your Strapi Cloud URL from the Strapi Cloud dashboard
2. Update `.env.local`:
   ```
   STRAPI_URL=https://your-project.strapi.app
   NEXT_PUBLIC_STRAPI_URL=https://your-project.strapi.app
   ```
3. If using authentication, add:
   ```
   STRAPI_TOKEN=your-api-token
   ```

### Content Types

The application integrates with the following Strapi content types:
- `homepage` - Homepage content
- `brands-page` - Brands listing page
- `about-us` - About Us page
- `blog-post` - Blog posts
- `product` - Products catalog
- `category` - Product categories
- `brand` - Brand information
- And more...

## 🎨 For Designers

### Viewing the Application

1. **Local Development**: 
   - Ask developer to run `pnpm dev`
   - Access at `http://localhost:3000`

2. **Staging/Production**:
   - Get deployment URL from developer
   - Access the live version

### Design Files Location

- CSS files: `/public/CSS/`
- Images: `/public/image/`
- Global styles: `/styles/globals.css`

### Key Pages

- Homepage: `/`
- Brands: `/brands`
- Products: `/archive-page`
- About Us: `/about-us`
- Contact: `/contact-us`
- Cart: `/cart`
- Account: `/account`

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + Global CSS
- **State Management**: React Hooks + LocalStorage
- **CMS**: Strapi (headless)
- **Package Manager**: pnpm

## 📝 Environment Variables

Create `.env.local` file:

```env
# Strapi Configuration
STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your-token-here

# Next.js
NODE_ENV=development
```

## 🔐 Security Notes

- Never commit `.env.local` or `.env` files
- Use `.env.example` as a template
- Keep API tokens secure

## 📦 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to `main`

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with descriptive messages
4. Push and create a Pull Request

## 📄 License

Proprietary - Eurodib

## 🔗 Links

- **Strapi Repository**: https://github.com/marketingeurodib/eurodib-strapi-cloud
- **Frontend Repository**: https://github.com/marketingeurodib/eurodib-frontend-cloud
