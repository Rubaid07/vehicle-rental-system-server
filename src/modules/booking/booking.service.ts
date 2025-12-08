import { pool } from "../../config/db";

const calculateTotalPrice = (
  dailyRentPrice: number,
  startDate: Date,
  endDate: Date
) => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return days * dailyRentPrice;
};

const createBooking = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const vehicleResult = await pool.query(
    `SELECT * FROM vehicles WHERE id=$1 AND availability_status='available'`,
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    return { success: false, message: "Vehicle not found" };
  }

  const vehicle = vehicleResult.rows[0];
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (endDate <= startDate) {
    return {
      success: false,
      message: "End date must be after start date",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate < today) {
    return {
      success: false,
      message: "Start date cannot be in the past",
    };
  }

  const overlappingBookings = await pool.query(
    `SELECT * FROM bookings 
     WHERE vehicle_id = $1 
     AND status = 'active'
     AND (
       (rent_start_date <= $2 AND rent_end_date >= $2) OR
       (rent_start_date <= $3 AND rent_end_date >= $3) OR
       (rent_start_date >= $2 AND rent_end_date <= $3)
     )`,
    [vehicle_id, rent_start_date, rent_end_date]
  );

  if (overlappingBookings.rows.length > 0) {
    return {
      success: false,
      message: "Vehicle is already booked for selected dates",
    };
  }

  // total price
  const total_price = calculateTotalPrice(
    parseFloat(vehicle.daily_rent_price),
    startDate,
    endDate
  );

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert booking
    const bookingResult = await client.query(
      `INSERT INTO bookings 
       (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
       VALUES ($1, $2, $3, $4, $5, 'active') 
       RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    // u pdate vehicle availability
    await client.query(
      `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
      [vehicle_id]
    );

    await client.query("COMMIT");

    // get booking with vhicle details
    const finalResult = await pool.query(
      `SELECT 
     b.id,
     b.customer_id,
     b.vehicle_id,
     TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') as rent_start_date,
     TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') as rent_end_date,
     b.total_price::float,
     b.status,
     v.vehicle_name,
     v.daily_rent_price::float
   FROM bookings b
   JOIN vehicles v ON b.vehicle_id = v.id
   WHERE b.id = $1`,
      [bookingResult.rows[0].id]
    );
    const bookingData = finalResult.rows[0];
    const response = {
      id: bookingData.id,
      customer_id: bookingData.customer_id,
      vehicle_id: bookingData.vehicle_id,
      rent_start_date: bookingData.rent_start_date,
      rent_end_date: bookingData.rent_end_date,
      total_price: bookingData.total_price,
      status: bookingData.status,
      vehicle: {
        vehicle_name: bookingData.vehicle_name,
        daily_rent_price: bookingData.daily_rent_price,
      },
    };

    return {
      success: true,
      message: "Booking created successfully",
      data: response,
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    return {
      success: false,
      message: error.message || "Failed to create booking",
    };
  } finally {
    client.release();
  }
};

export const bookingServices = {
  createBooking,
};
