import { ROLES } from "../../constants/index.js";
import { CustomerModel, DeliveryPartnerModel } from "../../models/UserModel.js";

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    let user =
      (await CustomerModel.findById(userId)) ||
      (await DeliveryPartnerModel.findById(userId));

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    let UserModel;

    if (user.role === ROLES.CUSTOMER) {
      UserModel = CustomerModel;
    } else if (user.role === ROLES.DELIVERY_PARTNER) {
      UserModel = DeliveryPartnerModel;
    } else {
      return res.status(400).send({ message: "Invalid user role" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.send({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
};
