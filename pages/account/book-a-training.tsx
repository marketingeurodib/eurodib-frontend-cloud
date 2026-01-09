import { useState, useEffect } from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { fetchTrainingUserProfile, type TrainingUserProfile } from '../../lib/api/profile';
import AccountLayout from '../../components/account/AccountLayout';
import { getTranslations, getCurrentLocale } from '../../lib/utils/translations';

interface BookATrainingProps {
  profile: TrainingUserProfile | null;
}

export const getServerSideProps: GetServerSideProps<BookATrainingProps> = async (ctx) => {
  // TODO: здесь нужно будет достать пользователя из сессии / токена
  // Например, если используешь NextAuth:
  // const session = await getServerSession(ctx.req, ctx.res, authOptions);
  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/sign-in',
  //       permanent: false,
  //     },
  //   };
  // }

  // Если хочешь уже сейчас закрыть страницу без auth — можно вот так:
  // if (!profile) {
  //   return {
  //     redirect: {
  //       destination: '/sign-in',
  //       permanent: false,
  //     },
  //   };
  // }

  const profile = await fetchTrainingUserProfile();

  return {
    props: {
      profile,
    },
  };
};

export default function BookATraining({ profile }: BookATrainingProps) {
  const [locale, setLocale] = useState<'en-CA' | 'fr-CA' | 'en-US'>('en-CA');
  const t = getTranslations(locale) || getTranslations('en-CA');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateLocale = () => {
        const currentLocale = getCurrentLocale();
        setLocale(currentLocale);
      };
      
      updateLocale();

      window.addEventListener('storage', updateLocale);
      window.addEventListener('focus', updateLocale);

      return () => {
        window.removeEventListener('storage', updateLocale);
        window.removeEventListener('focus', updateLocale);
      };
    }
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // TODO: здесь позже:
    // 1) собрать поля из формы (FormData)
    // 2) отправить на /api/training-requests (Next.js API route)
    //    а он уже сохранит в Strapi (collection-type "training-requests")
    //    и, если нужно, отправит письмо в CRM / Sales
    //
    // Пример:
    // const formData = new FormData(e.currentTarget);
    // await fetch('/api/training-requests', {
    //   method: 'POST',
    //   body: formData,
    // });

    alert('Training request form is ready. Connect backend/Strapi/CRM to submit.');
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
        <link rel="stylesheet" href="/CSS/training.css" />
        <link rel="stylesheet" href="/CSS/sing-in.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>{t.account.trainingPageTitle}</title>
        <meta
          name="description"
          content={t.account.trainingPageDescription}
        />
        <style jsx global>{`
          .eurodib-training-section {
            font-family: "Montserrat", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
              sans-serif;
            background-color: #ffffff;
            border-top: 3px solid #007bff;
            border-bottom: 3px solid #007bff;
            padding: 60px 30px 70px;
          }

          .eurodib-training-inner {
            max-width: 760px;
            margin: 0 auto;
            text-align: center;
          }

          .eurodib-training-title {
            margin: 0 0 10px;
            font-size: 32px;
            font-weight: 700;
            color: #0070c9;
          }

          .eurodib-training-subtitle {
            margin: 0 0 32px;
            font-size: 16px;
            color: #555555;
            line-height: 1.5;
          }

          .eurodib-training-box {
            background-color: #f3f4f6;
            padding: 30px 40px 40px;
            text-align: left;
          }

          .eurodib-training-form {
            font-size: 14px;
          }

          .eurodib-training-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #222222;
            margin-bottom: 16px;
          }

          .eurodib-training-label--textarea {
            margin-top: 4px;
          }

          .eurodib-training-required {
            color: #ff6b37;
            margin-left: 2px;
          }

          .eurodib-training-input-wrap,
          .eurodib-training-select-wrap {
            margin-top: 6px;
            position: relative;
          }

          .eurodib-training-input,
          .eurodib-training-select {
            width: 100%;
            border-radius: 999px;
            border: 2px solid #d5d5d5;
            padding: 15px 22px;
            font-size: 15px;
            outline: none;
            box-sizing: border-box;
            background-color: #ffffff;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }

          .eurodib-training-input:focus,
          .eurodib-training-select:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
          }

          .eurodib-training-select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            padding-right: 46px;
            background-color: #ffffff;
            cursor: pointer;
          }

          .eurodib-training-select-wrap::after {
            content: "";
            position: absolute;
            right: 20px;
            top: 50%;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 7px solid #555555;
            transform: translateY(-50%);
            pointer-events: none;
          }

          .eurodib-training-textarea-wrap {
            margin-top: 6px;
          }

          .eurodib-training-textarea {
            width: 100%;
            min-height: 140px;
            border-radius: 24px;
            border: 2px solid #d5d5d5;
            padding: 14px 20px;
            resize: vertical;
            outline: none;
            font-size: 14px;
            box-sizing: border-box;
            background-color: #ffffff;
          }

          .eurodib-training-textarea:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
          }

          .eurodib-training-consent {
            margin-top: 10px;
            margin-bottom: 18px;
          }

          .eurodib-training-consent-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            cursor: pointer;
            position: relative;
            user-select: none;
            font-size: 13px;
            color: #444444;
          }

          .eurodib-training-consent-checkbox {
            position: absolute;
            opacity: 0;
            pointer-events: none;
          }

          .eurodib-training-consent-custom {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid #0b4f9b;
            box-sizing: border-box;
            margin-top: 2px;
            background-color: #ffffff;
            position: relative;
          }

          .eurodib-training-consent-checkbox:checked + .eurodib-training-consent-custom {
            background-color: #0b4f9b;
          }

          .eurodib-training-consent-checkbox:checked + .eurodib-training-consent-custom::after {
            content: "";
            position: absolute;
            inset: 5px;
            border-radius: 50%;
            background-color: #ffffff;
          }

          .eurodib-training-consent-checkbox:focus,
          .eurodib-training-consent-checkbox:focus-visible {
            outline: none !important;
            box-shadow: none !important;
          }

          .eurodib-training-consent-checkbox:focus + .eurodib-training-consent-custom {
            outline: none !important;
            box-shadow: none !important;
          }

          .eurodib-training-consent-item:focus-within {
            outline: none !important;
            box-shadow: none !important;
          }

          .eurodib-training-bottom {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
          }

          .eurodib-training-recaptcha-placeholder {
            width: 302px;
            height: 76px;
            border-radius: 4px;
            border: 1px solid #d0d0d0;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #777777;
          }

          .eurodib-training-send-btn {
            padding: 14px 60px;
            border-radius: 999px;
            border: none;
            background-color: #008cff;
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 8px 18px rgba(0, 140, 255, 0.45);
            transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
          }

          .eurodib-training-send-btn:hover {
            background-color: #0073d6;
            box-shadow: 0 10px 22px rgba(0, 115, 214, 0.5);
            transform: translateY(-1px);
          }

          @media (max-width: 768px) {
            .eurodib-training-section {
              padding: 40px 16px 50px;
            }

            .eurodib-training-box {
              padding: 24px 18px 30px;
            }
          }
        `}</style>
      </Head>

      <AccountLayout>
        <section className="eurodib-training-section">
          <div className="eurodib-training-inner">
            <h1 className="eurodib-training-title">{t.account.trainingTitle}</h1>
            <p className="eurodib-training-subtitle">
              {t.account.trainingSubtitle ? (
                t.account.trainingSubtitle.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))
              ) : (
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
              )}
            </p>

            <div className="eurodib-training-box">
              <form className="eurodib-training-form" onSubmit={handleSubmit}>
                <label className="eurodib-training-label">
                  {t.account.trainingFirstName}<span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-input-wrap">
                    <input
                      type="text"
                      className="eurodib-training-input"
                      name="firstName"
                      required
                      defaultValue={profile?.firstName || ''}
                    />
                  </div>
                </label>

                <label className="eurodib-training-label">
                  {t.account.trainingLastName}<span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-input-wrap">
                    <input
                      type="text"
                      className="eurodib-training-input"
                      name="lastName"
                      required
                      defaultValue={profile?.lastName || ''}
                    />
                  </div>
                </label>

                <label className="eurodib-training-label">
                  {t.account.trainingCompanyName}<span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-input-wrap">
                    <input
                      type="text"
                      className="eurodib-training-input"
                      name="companyName"
                      required
                      defaultValue={profile?.companyName || ''}
                    />
                  </div>
                </label>

                <label className="eurodib-training-label">
                  {t.account.trainingPhone}<span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-input-wrap">
                    <input
                      type="tel"
                      className="eurodib-training-input"
                      name="phone"
                      required
                      defaultValue={profile?.phone || ''}
                    />
                  </div>
                </label>

                <label className="eurodib-training-label">
                  {t.account.trainingEmail}<span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-input-wrap">
                    <input
                      type="email"
                      className="eurodib-training-input"
                      name="email"
                      required
                      defaultValue={profile?.email || ''}
                    />
                  </div>
                </label>

                <label className="eurodib-training-label">
                  {t.account.trainingEstablishmentType}<span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-select-wrap">
                    <select
                      className="eurodib-training-select"
                      name="establishmentType"
                      required
                      defaultValue={t.account.trainingEstablishmentDistributor}
                    >
                      <option>{t.account.trainingEstablishmentDistributor}</option>
                      <option>{t.account.trainingEstablishmentRestaurant}</option>
                      <option>{t.account.trainingEstablishmentHotel}</option>
                      <option>{t.account.trainingEstablishmentCatering}</option>
                      <option>{t.account.trainingEstablishmentOther}</option>
                    </select>
                  </div>
                </label>

                <label className="eurodib-training-label">
                  {t.account.trainingFor}<span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-select-wrap">
                    <select
                      className="eurodib-training-select"
                      name="trainingFor"
                      required
                      defaultValue={t.account.trainingForInternalSales}
                    >
                      <option>{t.account.trainingForInternalSales}</option>
                      <option>{t.account.trainingForExternalSales}</option>
                      <option>{t.account.trainingForServiceTeam}</option>
                      <option>{t.account.trainingForEndUsers}</option>
                    </select>
                  </div>
                </label>

                <label className="eurodib-training-label">
                  {t.account.trainingAttendees}<span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-select-wrap">
                    <select
                      className="eurodib-training-select"
                      name="attendees"
                      required
                      defaultValue={t.account.trainingAttendees1}
                    >
                      <option>{t.account.trainingAttendees1}</option>
                      <option>{t.account.trainingAttendees2}</option>
                      <option>{t.account.trainingAttendees3}</option>
                      <option>{t.account.trainingAttendees4}</option>
                      <option>{t.account.trainingAttendees5Plus}</option>
                    </select>
                  </div>
                </label>

                <label className="eurodib-training-label">
                  {t.account.trainingFormat}<span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-select-wrap">
                    <select
                      className="eurodib-training-select"
                      name="format"
                      required
                      defaultValue={t.account.trainingFormatVideoCall}
                    >
                      <option>{t.account.trainingFormatVideoCall}</option>
                      <option>{t.account.trainingFormatOnSite}</option>
                      <option>{t.account.trainingFormatWebinar}</option>
                    </select>
                  </div>
                </label>

                <label className="eurodib-training-label">
                  {t.account.trainingIdealDate}<span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-input-wrap">
                    <input
                      type="text"
                      className="eurodib-training-input"
                      name="idealDate"
                      required
                    />
                  </div>
                </label>

                <label className="eurodib-training-label eurodib-training-label--textarea">
                  {t.account.trainingGoals}
                  <span className="eurodib-training-required">*</span>
                  <div className="eurodib-training-textarea-wrap">
                    <textarea
                      className="eurodib-training-textarea"
                      name="goals"
                      required
                    ></textarea>
                  </div>
                </label>

                {/* Newsletter consent */}
                <div className="eurodib-training-consent">
                  <label className="eurodib-training-consent-item">
                    <input
                      type="checkbox"
                      className="eurodib-training-consent-checkbox"
                      name="newsletter"
                      defaultChecked
                    />
                    <span className="eurodib-training-consent-custom"></span>
                    <span className="eurodib-training-consent-text">
                      {t.account.trainingNewsletter}
                    </span>
                  </label>
                </div>

                <div className="eurodib-training-bottom">
                  <div className="eurodib-training-recaptcha">
                    {/* реальный виджет reCAPTCHA сюда позже */}
                    <div className="eurodib-training-recaptcha-placeholder">{t.account.trainingNotRobot}</div>
                  </div>

                  <button type="submit" className="eurodib-training-send-btn">
                    {t.account.trainingSend}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </AccountLayout>
    </>
  );
}
