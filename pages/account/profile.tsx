import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import Breadcrumbs from '../../components/Breadcrumbs';
import { fetchUserProfile, type UserProfile } from '../../lib/api/profile';

interface ProfileUserProps {
  profile: UserProfile;
}

export const getServerSideProps: GetServerSideProps<ProfileUserProps> = async (ctx) => {
  // TODO: здесь позже возьмёшь userId из сессии / токена (NextAuth, custom auth и т.д.)
  // const userId = getUserIdFromSession(ctx.req);

  // Если пользователь не авторизован — можно будет сделать redirect на /sign-in
  // if (!userId) {
  //   return {
  //     redirect: {
  //       destination: '/sign-in',
  //       permanent: false,
  //     },
  //   };
  // }

  const profile = await fetchUserProfile();

  return {
    props: {
      profile,
    },
  };
};

export default function ProfileUser({ profile }: ProfileUserProps) {
  const router = useRouter();

  const handleSignOut = () => {
    // TODO: здесь позже добавишь очистку сессии/токена
    // Например: await fetch('/api/auth/signout', { method: 'POST' });
    // или: signOut() из NextAuth
    
    // Редирект на страницу входа
    router.push('/auth/sign-in');
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
        <title>My Account | EURODIB</title>
        <meta
          name="description"
          content="View and manage your Eurodib account details, company information and contact preferences."
        />
      </Head>

      <>
        <section className="eurodib-profile-section">
          <div className="eurodib-profile-inner">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'User profile' },
              ]}
              className="eurodib-profile-breadcrumbs"
            />

            <div className="eurodib-profile-layout">
              {/* Левое меню */}
              <nav className="eurodib-profile-sidebar">
                <ul className="eurodib-profile-menu">
                  <li className="eurodib-profile-menu-item eurodib-profile-menu-item--active">
                    <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--user">
                      <img src="/image/Group-264.png" alt="" />
                    </span>
                    <Link href="/account" className="eurodib-profile-menu-text">
                      Profile
                    </Link>
                  </li>

                  <li className="eurodib-profile-menu-item">
                    <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--cart">
                      <img src="/image/Layer_111.png" alt="" />
                    </span>
                    <Link href="/cart" className="eurodib-profile-menu-text">
                      Place your order
                    </Link>
                  </li>

                  <li className="eurodib-profile-menu-item">
                    <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--cart-history">
                      <img src="/image/Cart-history.png" alt="" />
                    </span>
                    <Link href="/account/orders" className="eurodib-profile-menu-text">
                      Previous orders
                    </Link>
                  </li>

                  <li className="eurodib-profile-menu-item">
                    <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--download">
                      <img src="/image/Layer_1222.png" alt="" />
                    </span>
                    <Link href="/account/resource-center" className="eurodib-profile-menu-text">
                      Resource center
                    </Link>
                  </li>

                  <li className="eurodib-profile-menu-item">
                    <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--training">
                      <img src="/image/Layer_1555.png" alt="" />
                    </span>
                    <Link href="/account/book-a-training" className="eurodib-profile-menu-text">
                      Book a training
                    </Link>
                  </li>

                  <li className="eurodib-profile-menu-item">
                    <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--signout">
                      <img src="/image/Layer_3331.png" alt="" />
                    </span>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="eurodib-profile-menu-text"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        font: 'inherit',
                        cursor: 'pointer',
                        color: 'inherit',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Правая основная карточка */}
              <div className="eurodib-profile-card">
                <div className="eurodib-profile-grid">
                  <div className="eurodib-profile-field">
                    <div className="eurodib-profile-label">First name</div>
                    <div className="eurodib-profile-value">{profile.firstName}</div>
                  </div>
                  <div className="eurodib-profile-field">
                    <div className="eurodib-profile-label">Last name</div>
                    <div className="eurodib-profile-value">{profile.lastName}</div>
                  </div>

                  <div className="eurodib-profile-field">
                    <div className="eurodib-profile-label">Company name</div>
                    <div className="eurodib-profile-value">{profile.companyName}</div>
                  </div>
                  <div className="eurodib-profile-field">
                    <div className="eurodib-profile-label">Preferred language</div>
                    <div className="eurodib-profile-value">
                      {profile.preferredLanguage}
                    </div>
                  </div>

                  <div className="eurodib-profile-field">
                    <div className="eurodib-profile-label">Email</div>
                    <div className="eurodib-profile-value">{profile.email}</div>
                  </div>
                  <div className="eurodib-profile-field">
                    <div className="eurodib-profile-label">Phone</div>
                    <div className="eurodib-profile-value">{profile.phone}</div>
                  </div>

                  <div className="eurodib-profile-field">
                    <div className="eurodib-profile-label">Address</div>
                    <div className="eurodib-profile-value">{profile.address}</div>
                  </div>
                  <div className="eurodib-profile-field">
                    <div className="eurodib-profile-label">City</div>
                    <div className="eurodib-profile-value">{profile.city}</div>
                  </div>

                  <div className="eurodib-profile-field">
                    <div className="eurodib-profile-label">Province</div>
                    <div className="eurodib-profile-value">{profile.province}</div>
                  </div>
                  <div className="eurodib-profile-field">
                    <div className="eurodib-profile-label">Postal code</div>
                    <div className="eurodib-profile-value">{profile.postalCode}</div>
                  </div>

                  <div className="eurodib-profile-field eurodib-profile-field--full">
                    <div className="eurodib-profile-label">Country</div>
                    <div className="eurodib-profile-value">{profile.country}</div>
                  </div>
                </div>

                {/* Edit area — пока просто текст, который можно будет отправлять в CRM/Strapi */}
                <div className="eurodib-profile-edit">
                  <div className="eurodib-profile-label eurodib-profile-label--edit">
                    Edit my profile
                  </div>
                  <div className="eurodib-profile-textarea-wrap">
                    <textarea
                      className="eurodib-profile-textarea"
                      placeholder="Please type in the changes you want to make"
                    ></textarea>
                  </div>

                  <button className="eurodib-profile-send-btn">Send</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>

    </>
  );
}
