interface Vehicle {
    vehical_name: string;
    type: "car" | "bike" | "van" | "SUV";
    registration_number: string;
    daily_rent_price: number;
    availability_status?: boolean;
}

export default Vehicle;
