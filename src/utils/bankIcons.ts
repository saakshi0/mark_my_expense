import { ImageSourcePropType } from 'react-native';

const bankIcons: { [key: string]: ImageSourcePropType } = {
    // Public Sector Banks
    sbi: require('../assets/banks/Public Sector Banks/bi-SBI.png'),
    pnb: require('../assets/banks/Public Sector Banks/bi-PNB.png'),
    bob: require('../assets/banks/Public Sector Banks/bi-Baroda.png'),
    canara: require('../assets/banks/Public Sector Banks/bi-Canara.png'),
    union: require('../assets/banks/Public Sector Banks/bi-Union.png'),
    boi: require('../assets/banks/Public Sector Banks/bi-BOI.png'),
    indian: require('../assets/banks/Public Sector Banks/bi-Indian.png'),
    central: require('../assets/banks/Public Sector Banks/bi-CBI.png'),
    ioB: require('../assets/banks/Public Sector Banks/bi-Overseas.png'),
    uco: require('../assets/banks/Public Sector Banks/bi-UCO.png'),
    bom: require('../assets/banks/Public Sector Banks/bi-Maharashtra.png'),
    punjab_sind: require('../assets/banks/Public Sector Banks/bi-PSB.png'),

    // Private Sector Banks
    hdfc: require('../assets/banks/Private Sector Banks/bi-HDFC.png'),
    icici: require('../assets/banks/Private Sector Banks/bi-ICICI.png'),
    axis: require('../assets/banks/Private Sector Banks/bi-axis.png'),
    kotak: require('../assets/banks/Private Sector Banks/bi-kotak.png'),
    indusind: require('../assets/banks/Private Sector Banks/bi-Induslnd.png'),
    yes: require('../assets/banks/Private Sector Banks/bi-Yes.png'),
    idfc: require('../assets/banks/Private Sector Banks/bi-IDFC.png'),
    idbi: require('../assets/banks/Private Sector Banks/bi-IDBI.png'),
    federal: require('../assets/banks/Private Sector Banks/bi-Federal.png'),
    rbl: require('../assets/banks/Private Sector Banks/bi-RBL.png'),
    south_indian: require('../assets/banks/Private Sector Banks/bi-South Indian.png'),

    // Payment Banks
    paytm: require('../assets/banks/Payment Banks/bi-PayTm.png'),
    airtel: require('../assets/banks/Payment Banks/bi-Airtel.png'),
    jio: require('../assets/banks/Payment Banks/bi-Jio.png'),

    // Foreign Banks
    citibank: require('../assets/banks/Foreign Banks/bi-Citibank.png'),
    hsbc: require('../assets/banks/Foreign Banks/bi-HSBC.png'),
    sc: require('../assets/banks/Foreign Banks/bi-Standard Chatered.png'),
    dbs: require('../assets/banks/Foreign Banks/bi-DBS.png'),
    deutsche: require('../assets/banks/Foreign Banks/bi-Deutsche.png'),

    // Placeholder
    default: require('../assets/banks/bi-Placeholder.png'),
};

export const getBankIcon = (accountName: string): ImageSourcePropType => {
    const normalizedName = accountName.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (normalizedName.includes('sbi') || normalizedName.includes('statebank')) return bankIcons.sbi;
    if (normalizedName.includes('pnb') || normalizedName.includes('punjabnational')) return bankIcons.pnb;
    if (normalizedName.includes('bob') || normalizedName.includes('baroda')) return bankIcons.bob;
    if (normalizedName.includes('canara')) return bankIcons.canara;
    if (normalizedName.includes('union')) return bankIcons.union;
    if (normalizedName.includes('boi') || normalizedName.includes('bankofindia')) return bankIcons.boi;
    if (normalizedName.includes('indian')) return bankIcons.indian;
    if (normalizedName.includes('central')) return bankIcons.central;
    if (normalizedName.includes('overseas')) return bankIcons.ioB;
    if (normalizedName.includes('uco')) return bankIcons.uco;
    if (normalizedName.includes('maharashtra')) return bankIcons.bom;
    if (normalizedName.includes('sind')) return bankIcons.punjab_sind;

    if (normalizedName.includes('hdfc')) return bankIcons.hdfc;
    if (normalizedName.includes('icici')) return bankIcons.icici;
    if (normalizedName.includes('axis')) return bankIcons.axis;
    if (normalizedName.includes('kotak')) return bankIcons.kotak;
    if (normalizedName.includes('indus')) return bankIcons.indusind;
    if (normalizedName.includes('yes')) return bankIcons.yes;
    if (normalizedName.includes('idfc')) return bankIcons.idfc;
    if (normalizedName.includes('idbi')) return bankIcons.idbi;
    if (normalizedName.includes('federal')) return bankIcons.federal;
    if (normalizedName.includes('rbl')) return bankIcons.rbl;
    if (normalizedName.includes('south')) return bankIcons.south_indian;

    if (normalizedName.includes('paytm')) return bankIcons.paytm;
    if (normalizedName.includes('airtel')) return bankIcons.airtel;
    if (normalizedName.includes('jio')) return bankIcons.jio;

    if (normalizedName.includes('citi')) return bankIcons.citibank;
    if (normalizedName.includes('hsbc')) return bankIcons.hsbc;
    if (normalizedName.includes('standard') || normalizedName.includes('chartered')) return bankIcons.sc;
    if (normalizedName.includes('dbs')) return bankIcons.dbs;
    if (normalizedName.includes('deutsche')) return bankIcons.deutsche;

    return bankIcons.default;
};
