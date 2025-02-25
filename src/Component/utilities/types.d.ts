
interface userProps {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: "customer" | "merchant";
    accepted: "accept" | "reject" | "none";
    customerId: string | null;
    userContent: profileProp;
}
interface Catagoryprops {
    id: string;
    categories: string;
    description: string | null;
    Imagefile: string | string[]
  }
 interface sessionProps {
    id: string;
    expiresAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string;
}
interface profileProp {
    id: string;
    userId: string;
    type: string | null;
    facebook: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    description: string | null;
    instagram: string | null;
    companyName: string | null;
    imageFile: string | null;
    telegram: string | null;
    x: string | null;
    phoneNumber1: string | null;
    phoneNumber2: string | null
}
interface postProps {
    title: string;
    description: string | null;
    catagory: string;
    userId: string;
    id: string;
    file: string[];
    profileId: string;
    createdAt: Date;
    updatedAt: Date | null;
    isSold: boolean | null;
    soldDate: string;
    price: string;
}