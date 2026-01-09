import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import Breadcrumbs from '../components/Breadcrumbs';

type TermsPage = {
  title: string;
  intro: string;
  contentHtml: string; // основной текст условий, из Strapi как rich text/HTML
  seoTitle?: string;
  seoDescription?: string;
};

interface TermsAndConditionsProps {
  page: TermsPage;
}

export const getServerSideProps: GetServerSideProps<TermsAndConditionsProps> = async () => {
  // TODO: заменить на реальный запрос к Strapi (single-type или collection-type)
  //
  // Пример для single-type "terms-and-conditions":
  // const res = await fetch(`${process.env.STRAPI_URL}/api/terms-and-conditions`);
  // const json = await res.json();
  // const data = json.data.attributes;
  //
  // const page: TermsPage = {
  //   title: data.title,
  //   intro: data.intro,
  //   contentHtml: data.content, // если Strapi возвращает уже HTML
  //   seoTitle: data.seoTitle,
  //   seoDescription: data.seoDescription,
  // };

  const page: TermsPage = {
    title: 'Terms and conditions',
    intro:
      'Welcome to the Internet site of Eurodib. This Internet site comprises various Web pages and is owned and operated by Eurodib (collectively named as "Eurodib").',
    seoTitle: 'Terms and Conditions | Eurodib',
    seoDescription:
      "Read the terms and conditions governing the use of Eurodib's website, services, and online content.",
    contentHtml: `
      <p>
        PLEASE TAKE NOTE OF THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING THIS INTERNET SITE
        since both use of this Internet Site as well as all services offered on this Internet Site
        are subject to the legal terms and conditions outlined below.
      </p>
      <p>
        Your use of this Internet Site in any manner, including browsing, activating a Eurodib account
        with us, constitutes your acknowledgement that you have read the Terms and Conditions and that
        you agree to follow and be bound by them. Eurodib reserves the right to modify or change the
        Terms and Conditions at any time without prior notice to you. Your continued use of the
        Eurodib.com website signifies your acceptance of such revised Terms and Conditions; therefore,
        we recommend that you read them carefully each time you use this Internet Site.
      </p>
      <p>
        Please note that the guidelines, policies and other terms and conditions of use in our
        catalogues and in other Eurodib-affiliated or co-branded websites may vary.
      </p>
      <p>
        Please also note that products, prices and promotions on the website and in our catalogues may
        vary. Please also see Our Policies section on the site.
      </p>
      <h2>Personal and non-commercial use limitation</h2>
      <p>
        You may copy electronically or print hard copies of any of the Web pages from this Internet
        site provided that such copying or printing is for your personal non-commercial and lawful use,
        and provided that such copies clearly display the copyright, trademark and any other proprietary
        notices of Eurodib. Except when the express written authorization of Eurodib is granted, you
        may not copy, transmit, distribute, display, perform, reproduce, publish, transfer, frame or
        create derivative works of any of the Web pages and information (including any portion of them)
        which is obtained from this Internet site. Eurodib reserves complete title and full intellectual
        property rights in any material that you may copy electronically or print from this Internet site.
      </p>
      <h2>Prohibited or Unlawful Use</h2>
      <p>
        You warrant to Eurodib that you will not use this Internet site for any purpose that is either
        unlawful or prohibited by the Terms and Conditions. You agree not to use this Internet site in
        any manner which could cause it to be disabled, damaged, overloaded, or impaired or interfere
        with any other person&apos;s use and enjoyment of this Internet site or even in a manner that
        could harm the reputation of Eurodib. You may not misrepresent your identity or location as a
        user and you may not obtain or attempt to obtain any materials or information through any means
        not intentionally made available or provided for through this Internet site.
      </p>
      <h2>Account Name and Password</h2>
      <p>
        For certain activities on this Internet site, you are required to have an active Eurodib account
        and a password. It is solely your responsibility to keep your account information and password
        secure. You must not disclose your password to anyone. You agree to notify Eurodib immediately of
        any unauthorized use of your account. EURODIB DISCLAIMS ALL LIABILITY ARISING FROM OR RELATED TO
        YOUR FAILURE TO KEEP YOUR ACCOUNT NAME AND PASSWORD SECURE.
      </p>
      <h2>Exclusive Proprietary Rights</h2>
      <p>
        "Eurodib.com", Eurodib logos and trademarks, as well as certain other names, words, logos,
        slogans, images, marks, trade names, and trademarks used on this Internet site, are the
        properties of their respective owners. You may not use, reproduce, copy or manipulate any such
        logos, trademarks, slogans, images, marks or trade names in any manner without the prior written
        consent of the owner.
      </p>
      <p>
        All content of this Internet site, including but not limited to text, graphics, logos, icons,
        images, audio clips, and software, is the property of Eurodib or its content suppliers and is
        protected by Canadian and international copyright laws.
      </p>
    `,
  };

  return {
    props: {
      page,
    },
  };
};

export default function TermsAndConditions({ page }: TermsAndConditionsProps) {
  const title = page.seoTitle || page.title || 'Terms and Conditions';
  const description =
    page.seoDescription ||
    "Read the terms and conditions governing the use of Eurodib's website, services, and online content.";

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/rules.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Terms and conditions' },
          ]}
        />

        <div className="background-rules"></div>

        <div className="description-page-rules">
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>

        <div className="rules-info">
          <div
            // Основной текст условий — управление из Strapi (rich text → HTML)
            dangerouslySetInnerHTML={{ __html: page.contentHtml }}
          />
        </div>
      </>

        {/* Email Signup Section */}

      {/* Скрипты, если они нужны глобально */}
      <Script
        src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
      <Script src="/JS/main.js" strategy="afterInteractive" />
    </>
  );
}
