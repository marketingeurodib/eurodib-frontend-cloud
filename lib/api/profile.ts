// lib/api/profile.ts
// TODO: Заменить mock-данные на реальный запрос к Strapi/SAP
// Пример: const res = await fetch(`${process.env.STRAPI_URL}/api/customers/me`, { headers: { Authorization: `Bearer ${token}` }});

export interface UserProfile {
  firstName: string;
  lastName: string;
  companyName: string;
  preferredLanguage: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface TrainingUserProfile {
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  email: string;
}

export async function fetchUserProfile(userId?: string): Promise<UserProfile> {
  // TODO: здесь позже возьмёшь userId из сессии / токена (NextAuth, custom auth и т.д.)
  // TODO: реальный запрос в Strapi (куда уже синкнут данные из SAP)
  //
  // Пример:
  // const res = await fetch(
  //   `${process.env.STRAPI_URL}/api/customers/me`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${accessTokenFromSession}`,
  //     },
  //   }
  // );
  // const json = await res.json();
  // const data = json.data.attributes;
  //
  // return {
  //   firstName: data.firstName,
  //   lastName: data.lastName,
  //   companyName: data.companyName,
  //   preferredLanguage: data.preferredLanguage,
  //   email: data.email,
  //   phone: data.phone,
  //   address: data.address,
  //   city: data.city,
  //   province: data.province,
  //   postalCode: data.postalCode,
  //   country: data.country,
  // };

  // Временная заглушка, чтобы страница уже работала
  return {
    firstName: 'Frank',
    lastName: 'DiSalvio',
    companyName: 'Giuseppe pizza',
    preferredLanguage: 'English',
    email: 'Frank@giuseppepizza.com',
    phone: '438-567-8901',
    address: '987 Eccellente Drive',
    city: 'Hamilton',
    province: 'Ontario',
    postalCode: 'L9C 2Z9',
    country: 'Canada',
  };
}

export async function fetchTrainingUserProfile(userId?: string): Promise<TrainingUserProfile | null> {
  // TODO: реальный запрос в Strapi, где профиль уже синкнут из SAP
  //
  // const res = await fetch(
  //   `${process.env.STRAPI_URL}/api/customers/me`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${accessTokenFromSession}`,
  //     },
  //   }
  // );
  // const json = await res.json();
  // const data = json.data.attributes;
  //
  // return {
  //   firstName: data.firstName,
  //   lastName: data.lastName,
  //   companyName: data.companyName,
  //   phone: data.phone,
  //   email: data.email,
  // };

  // ВРЕМЕННАЯ ЗАГЛУШКА: профиль есть, чтобы поля в форме выглядели «живыми»
  return {
    firstName: 'Frank',
    lastName: 'DiSalvio',
    companyName: 'Giuseppe pizza',
    phone: '438-567-8901',
    email: 'Frank@giuseppepizza.com',
  };
}

