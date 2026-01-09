import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { fetchPriceLists, type PriceListItem } from '@/lib/api/priceLists';
import { getLocaleFromContext } from '@/lib/utils/locale';

interface AfterLoginPagePriceProps {
  priceLists: PriceListItem[];
}

export const getServerSideProps: GetServerSideProps<AfterLoginPagePriceProps> = async (ctx) => {
  // 1) Проверка авторизации (заглушка)
  // Когда добавишь auth (NextAuth или свой middleware),
  // здесь можно сделать редирект, если пользователь не залогинен.
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

  // Получаем локаль из контекста (cookie, query, header)
  const locale = getLocaleFromContext(ctx);
  const priceLists = await fetchPriceLists(locale);

  return {
    props: {
      priceLists,
    },
  };
};

const AfterLoginPagePrice: NextPage<AfterLoginPagePriceProps> = ({ priceLists }) => {
  // Здесь позже можно будет добавить "Select all" + массовое скачивание,
  // но сейчас оставляем максимально близко к макету.

  const handleDownload = () => {
    // TODO: собрать выбранные чекбоксы и скачать соответствующие файлы.
    // Пример:
    // const checked = Array.from(
    //   document.querySelectorAll<HTMLInputElement>('.edbprice-checkbox:checked')
    // );
    // const ids = checked.map((cb) => cb.value);
    // и по этим id найти priceLists и открыть/скачать fileUrl.
  };

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
        <title>Price lists | EURODIB</title>
        <meta
          name="description"
          content="Access Eurodib price lists for authorized dealers: current pricing, regional rates and special offers."
        />
      </Head>

      <>
        <section className="edbprice-wrapper">
          <div className="edbprice-container">
            <h2 className="edbprice-title">Price lists</h2>

            <p className="edbprice-subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque euismod
              elementum convallis. Quisque rutrum tortor at elit feugiat egestas.
            </p>

            <div className="edbprice-actions">
              <button
                type="button"
                className="edbprice-download-btn"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>

            <div className="edbprice-list">
              {priceLists.map((pl) => (
                <label key={pl.id} className="edbprice-item">
                  <input
                    type="checkbox"
                    className="edbprice-checkbox"
                    value={pl.id}
                    data-file-url={pl.fileUrl}
                  />
                  <span className="edbprice-checkbox-custom"></span>
                  <span className="edbprice-item-text">
                    {pl.title}
                    {pl.validFrom && pl.validTo ? (
                      <>
                        {' '}
                        ({pl.validFrom} – {pl.validTo})
                      </>
                    ) : null}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>
      </>


      <Script
        src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
      <Script src="/JS/main.js" strategy="afterInteractive" />
    </>
  );
};

export default AfterLoginPagePrice;
