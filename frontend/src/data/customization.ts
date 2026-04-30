import { TranslationKey } from '../i18n';

export interface Skin {
  id: string;
  titleKey: TranslationKey | string;
  descriptionKey: TranslationKey | string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
}

export const SKINS: Skin[] = [
  {
    id: 'skin_classic',
    titleKey: 'collection.classicGold',
    descriptionKey: 'collection.defaultSkin',
    price: 0,
    rarity: 'common',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0nfC_xuPostHaUkOpdsL5CQKCy0gy43C7AGXMelZyguT9N45amDcEIVeZJm5u9WJPcd6KduF8jApFYCBOAqOQ2qp_LcbraAQk5Z_CjwY8FpU-lqdpnkgJ6GfhJHlSvSm6Ry9Ip9smPFiiPtRyZKrIxL7MZiaL6iVY7i7kCRG2Cc3T-sH5uzoCto-FXHY8BFlLur1oWDvg-Seld3bEgfgmSOHsdoWScJflMtonEsBVMlJhyXRiR2VU97FyipPQDIptFU0j9s3aJB4'
  },
  {
    id: 'skin_cyber',
    titleKey: 'store.epicSkin',
    descriptionKey: 'store.epicSkinDesc',
    price: 5000,
    rarity: 'epic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB04bMxU0So--6DGKLwG0nY55DpGDaIj-YdEbrh_fofYP_D7lVqTX63YMroz9SZ9eGQq-Mq1zMqLSYGhelgm0cyzZoLkvM_jZQOwmqd_M6ACPf-G3MrSmfPMaEAhZcpkwQtCmaaX_Lu5xPoZ_d5ChOJwPROoMGOQZReuXhGGxtgDGEI-WXi5e9hcRaw3Id1Ohk-qap30uL7VRQ0inQXRYBvYAMmj3soPNs6BREXx_fP-AwMAK3chqG0PZoxiK87tTgii1XEZJFpaEA'
  },
  {
    id: 'skin_minty',
    titleKey: 'collection.mintyFresh',
    descriptionKey: 'collection.commonSkin',
    price: 1000,
    rarity: 'common',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnqB17lGz8PZ0vOIny35fKng_1S6p4s2VWe2qP6N7rD8HwP9D0XbI3gTq2N6i1Uo2I0S_o1gA5E4F8y_6Tf05s6H-jC6Zl1L0G9U0NfH9_K8O9V9P2G5qW-I8T8X5l2Z8xQn-qTcFzQk_C_B6I8o0I8wW0H9T9H_J_Q7J8J8T8cKcQv3O9yZ0nI_S0B6X0l6p_yT9O_Z9Z9F9' // Placeholder or we could reuse the same if it breaks
  },
  {
    id: 'skin_nebula',
    titleKey: 'collection.nebulaSpark',
    descriptionKey: 'collection.legendarySkin',
    price: 25000,
    rarity: 'legendary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1_O_p_2L6p_C_z7_F_G0w9C9g_H_Q7B_T_D_y_B_g9_w9l_m_F_S_P0T9_E_B_p_O_W_F_z_y_D_t_H9_z_O9_T_I0B9Q_i_c0P_Z_M_s9K_w_0Z9T0_X9_e_I0D_o_N_T9U_C8' // Placeholder
  }
];

export interface CustomizationItem {
  id: string;
  titleKey: TranslationKey | string;
  descriptionKey?: TranslationKey | string;
  price: number;
  type: 'skin' | 'hat' | 'accessory';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
}

export const CUSTOMIZATION_ITEMS: CustomizationItem[] = [
  {
    id: 'skin_cyber',
    titleKey: 'store.epicSkin',
    descriptionKey: 'store.epicSkinDesc',
    price: 5000,
    type: 'skin',
    rarity: 'epic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB04bMxU0So--6DGKLwG0nY55DpGDaIj-YdEbrh_fofYP_D7lVqTX63YMroz9SZ9eGQq-Mq1zMqLSYGhelgm0cyzZoLkvM_jZQOwmqd_M6ACPf-G3MrSmfPMaEAhZcpkwQtCmaaX_Lu5xPoZ_d5ChOJwPROoMGOQZReuXhGGxtgDGEI-WXi5e9hcRaw3Id1Ohk-qap30uL7VRQ0inQXRYBvYAMmj3soPNs6BREXx_fP-AwMAK3chqG0PZoxiK87tTgii1XEZJFpaEA'
  },
  {
    id: 'hat_mandarin',
    titleKey: 'store.hatMandarin',
    price: 150,
    type: 'hat',
    rarity: 'common',
    image: 'smile' // Using icon names for now
  },
  {
    id: 'acc_sparkle',
    titleKey: 'store.accSparkle',
    price: 300,
    type: 'accessory',
    rarity: 'rare',
    image: 'sparkles'
  }
];

// For the collection screen
export const MY_COLLECTION = [
  {
    id: 'skin_classic',
    isEquipped: true,
  },
  {
    id: 'skin_minty',
    isEquipped: false,
  },
  {
    id: 'skin_nebula',
    locked: true,
    isEquipped: false,
  }
];
