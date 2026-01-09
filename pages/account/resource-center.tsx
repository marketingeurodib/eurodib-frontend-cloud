import Head from 'next/head';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';

interface ResourceCenterProps {
  // в будущем сюда можно пробросить категории/ресурсы из Strapi
}

export const getServerSideProps: GetServerSideProps<ResourceCenterProps> = async (ctx) => {
  // TODO: Здесь нужно будет добавить проверку авторизации
  // Пример с NextAuth (позже подключишь по факту):
  //
  // const session = await getServerSession(ctx.req, ctx.res, authOptions);
  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/sign-in',
  //       permanent: false,
  //     },
  //   };
  // }
  //
  // Здесь же можно будет дергать Strapi:
  // const res = await fetch(`${process.env.STRAPI_URL}/api/resource-center-categories`, { ... });
  // const data = await res.json();

  return {
    props: {
      // categories: data ?? []
    },
  };
};

export default function ResourceCenter({}: ResourceCenterProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css"
        />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/sing-in.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>Resource center | EURODIB</title>
        <meta
          name="description"
          content="Access Eurodib product resources: pictures, spec sheets, manuals, catalogues, logos, promos, price lists, videos, CAD files and part lists."
        />

        {/* Стили именно для секции Resource center, как в макете */}
        <style jsx global>{`
          .eurodib-resource-section {
            font-family: "Montserrat", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
              sans-serif;
            background-color: #ffffff;
            padding: 60px 30px 80px;
          }

          .eurodib-resource-inner {
            max-width: 1180px;
            margin: 0 auto;
            text-align: center;
          }

          .eurodib-resource-title {
            margin: 0 0 40px;
            font-size: 32px;
            font-weight: 700;
            color: #0070c9;
          }

          .eurodib-resource-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 40px 60px; /* вертикальный / горизонтальный отступы */
          }

          .eurodib-resource-item {
            width: 170px;
            height: 170px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            text-transform: uppercase;
            font-weight: 700;
            font-size: 16px;
            color: #ffffff;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          }

          .eurodib-resource-item--dark {
            background-color: #1b63b4; /* тёмно-синий круг */
          }

          .eurodib-resource-item--light {
            background-color: #0099ff; /* более светлый синий */
          }

          .eurodib-resource-label {
            line-height: 1.2;
            font-size: 20px;
            font-weight: 700;
          }

          .eurodib-resource-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 22px rgba(0, 112, 201, 0.4);
            opacity: 0.95;
          }

          @media (max-width: 900px) {
            .eurodib-resource-section {
              padding: 40px 16px 60px;
            }

            .eurodib-resource-grid {
              gap: 32px 32px;
            }
          }

          @media (max-width: 600px) {
            .eurodib-resource-item {
              width: 150px;
              height: 150px;
              font-size: 14px;
            }
          }
        `}</style>
      </Head>

      <>
        <section className="eurodib-resource-section">
          <div className="eurodib-resource-inner">
            <h1 className="eurodib-resource-title">Resource center</h1>

            <div className="eurodib-resource-grid">
              <Link
                href="/account/resource-center?category=product-pictures"
                className="eurodib-resource-item eurodib-resource-item--dark"
              >
                <span className="eurodib-resource-label">
                  Product
                  <br />
                  pictures
                </span>
              </Link>

              <Link
                href="/account/resource-center?category=spec-sheets"
                className="eurodib-resource-item eurodib-resource-item--light"
              >
                <span className="eurodib-resource-label">
                  Spec
                  <br />
                  sheets
                </span>
              </Link>

              <Link
                href="/account/resource-center?category=user-manuals"
                className="eurodib-resource-item eurodib-resource-item--dark"
              >
                <span className="eurodib-resource-label">
                  User
                  <br />
                  manuals
                </span>
              </Link>

              <Link
                href="/account/resource-center/catalogues"
                className="eurodib-resource-item eurodib-resource-item--light"
              >
                <span className="eurodib-resource-label">Catalogues</span>
              </Link>

              <Link
                href="/account/resource-center?category=logos"
                className="eurodib-resource-item eurodib-resource-item--dark"
              >
                <span className="eurodib-resource-label">Logos</span>
              </Link>

              <Link
                href="/account/resource-center/promos"
                className="eurodib-resource-item eurodib-resource-item--light"
              >
                <span className="eurodib-resource-label">Promos</span>
              </Link>

              <Link
                href="/account/resource-center/price-lists"
                className="eurodib-resource-item eurodib-resource-item--dark"
              >
                <span className="eurodib-resource-label">Price lists</span>
              </Link>

              <Link
                href="/account/resource-center/videos"
                className="eurodib-resource-item eurodib-resource-item--light"
              >
                <span className="eurodib-resource-label">Videos</span>
              </Link>

              <Link
                href="/account/resource-center?category=cad"
                className="eurodib-resource-item eurodib-resource-item--dark"
              >
                <span className="eurodib-resource-label">CAD</span>
              </Link>

              <Link
                href="/account/resource-center?category=part-lists"
                className="eurodib-resource-item eurodib-resource-item--light"
              >
                <span className="eurodib-resource-label">Part lists</span>
              </Link>
            </div>
          </div>
        </section>

      </>
    </>
  );
}
