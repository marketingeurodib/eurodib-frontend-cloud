// lib/api/terms.ts
// TODO: Заменить mock-данные на реальный запрос к Strapi
// Пример: const res = await fetch(`${process.env.STRAPI_URL}/api/terms-and-conditions`);

export interface TermsPage {
  title: string;
  intro: string;
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
}

export async function fetchTermsPage(): Promise<TermsPage> {
  // TODO: заменить на реальный запрос к Strapi
  // Пример для single-type "terms-and-conditions":
  // const res = await fetch(`${process.env.STRAPI_URL}/api/terms-and-conditions`);
  // const json = await res.json();
  // const data = json.data.attributes;
  //
  // return {
  //   title: data.title,
  //   intro: data.intro,
  //   contentHtml: data.content, // если Strapi возвращает уже HTML
  //   seoTitle: data.seoTitle,
  //   seoDescription: data.seoDescription,
  // };

  return {
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
        user of this Internet site.
      </p>
    `,
  };
}

