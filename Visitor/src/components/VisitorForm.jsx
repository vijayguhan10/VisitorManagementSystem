import { useState } from "react";
import { motion } from "framer-motion";
import CameraCapture from "./CameraCapture";
import FormField from "./FormField";
import axios from "axios";
import { toast } from "react-toastify";
function VisitorForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    visitorName: "",
    phoneNumber: "",
    reason: "",
    address: "",
    companions: [],
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("function called....");
    console.log(formData);

    try {
      // 1. Upload image to Cloudinary
      const cloudData = new FormData();
      cloudData.append("file", formData.photo);
      cloudData.append("upload_preset", "visitor management");
      cloudData.append("cloud_name", "dcwji5ei8");

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dcwji5ei8/image/upload",
        {
          method: "POST",
          body: cloudData,
        }
      );

      const cloudinaryResult = await cloudRes.json();
      const fileUrl = cloudinaryResult.secure_url;

      if (!fileUrl) {
        toast.error("Image upload failed");
        setIsSubmitting(false);
        return;
      }

      console.log("Uploaded Image URL:", fileUrl);

      // 2. Prepare payload
      const payload = {
        visitorName: formData.visitorName,
        phoneNumber: formData.phoneNumber,
        reason: formData.reason,
        address: formData.address,
        photoUrl: fileUrl,
        companions: formData.companions,
        inTime: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      };

      // 3. Submit to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/visitors/register`,
        payload
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Visitor details submitted successfully!");

        // Optional callback
        if (onSubmitSuccess) {
          onSubmitSuccess(payload);
        }

        // Reset form
        setFormData({
          visitorName: "",
          phoneNumber: "",
          reason: "",
          address: "",
          companions: [],
          photo: null,
        });

        // Reset UI states
        setStep(1);
        setShowConfirmation(false);
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again!");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCompanionChange = (index, field, value) => {
    setFormData((prev) => {
      const newCompanions = [...prev.companions];
      newCompanions[index] = { ...newCompanions[index], [field]: value };
      return { ...prev, companions: newCompanions };
    });
  };

  const addCompanion = () => {
    setFormData((prev) => ({
      ...prev,
      companions: [...prev.companions, { name: "", phoneNumber: "" }],
    }));
  };

  const removeCompanion = (index) => {
    setFormData((prev) => ({
      ...prev,
      companions: prev.companions.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoCapture = (photoDataUrl) => {
    setFormData((prev) => ({ ...prev, photo: photoDataUrl }));
    if (errors.photo) {
      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.visitorName.trim()) {
      newErrors.visitorName = "Name is required";
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for visit is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Validate companions if any
    formData.companions.forEach((companion, index) => {
      if (companion.name.trim() && !companion.phoneNumber.trim()) {
        newErrors[`companion${index}Phone`] =
          "Phone number is required for companion";
      }
      if (!companion.name.trim() && companion.phoneNumber.trim()) {
        newErrors[`companion${index}Name`] = "Name is required for companion";
      }
      if (
        companion.phoneNumber.trim() &&
        !phoneRegex.test(companion.phoneNumber.replace(/\D/g, ""))
      ) {
        newErrors[`companion${index}Phone`] =
          "Please enter a valid 10-digit phone number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.photo) {
      newErrors.photo = "Please capture a photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handlePreview = () => {
    if (validateStep2()) {
      setShowConfirmation(true);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 md:p-6 lg:p-8">
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-6">
        Visitor Registration
      </h2>

      {!showConfirmation ? (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="max-w-2xl mx-auto"
        >
          {step === 1 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={formVariants}
              className="space-y-4 md:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <FormField
                  label="Visitor Name"
                  name="visitorName"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.visitorName}
                  onChange={handleChange}
                  error={errors.visitorName}
                  required
                />

                <FormField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber}
                  required
                />
              </div>

              <FormField
                label="Reason for Visit"
                name="reason"
                type="text"
                placeholder="Enter reason for visit"
                value={formData.reason}
                onChange={handleChange}
                error={errors.reason}
                required
              />

              <FormField
                label="Address"
                name="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                required
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-neutral-800">
                    Companions
                  </h3>
                  <button
                    type="button"
                    onClick={addCompanion}
                    className="text-sm px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 transition-colors"
                  >
                    + Add Companion
                  </button>
                </div>

                {formData.companions.map((companion, index) => (
                  <div
                    key={index}
                    className="p-4 bg-neutral-50 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-neutral-600">
                        Companion {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeCompanion(index)}
                        className="text-sm text-error-600 hover:text-error-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Name"
                        name={`companion${index}Name`}
                        type="text"
                        placeholder="Enter companion's name"
                        value={companion.name}
                        onChange={(e) =>
                          handleCompanionChange(index, "name", e.target.value)
                        }
                        error={errors[`companion${index}Name`]}
                      />

                      <FormField
                        label="Phone Number"
                        name={`companion${index}Phone`}
                        type="tel"
                        placeholder="Enter companion's phone"
                        value={companion.phoneNumber}
                        onChange={(e) =>
                          handleCompanionChange(
                            index,
                            "phoneNumber",
                            e.target.value
                          )
                        }
                        error={errors[`companion${index}Phone`]}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Next: Capture Photo
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={formVariants}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                  Take a Photo
                </h3>
                <p className="text-sm text-neutral-500 mb-4">
                  Please capture a clear photo of the visitor
                </p>

                <CameraCapture
                  onCapture={handlePhotoCapture}
                  currentPhoto={formData.photo}
                  error={errors.photo}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-3 px-4 bg-white border border-neutral-300 text-neutral-700 font-medium rounded-lg transition-colors duration-200 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex-1 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Preview & Submit
                </button>
              </div>
            </motion.div>
          )}
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 max-w-4xl w-full px-4 sm:px-6 mx-auto"
        >
          <div className="bg-primary-50 rounded-lg p-4 sm:p-6 border border-primary-200">
            <h3 className="text-lg sm:text-xl font-semibold text-primary-800 mb-4">
              Confirm Visitor Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Visitor Name</p>
                <p className="font-medium text-neutral-800 break-words">
                  {formData.visitorName}
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">Phone Number</p>
                <p className="font-medium text-neutral-800 break-words">
                  {formData.phoneNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">Reason for Visit</p>
                <p className="font-medium text-neutral-800 break-words">
                  {formData.reason}
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">Address</p>
                <p className="font-medium text-neutral-800 break-words">
                  {formData.address}
                </p>
              </div>

              {formData.companions.length > 0 && (
                <div className="col-span-1 md:col-span-2">
                  <p className="text-sm text-neutral-500 mb-2">Companions</p>
                  <div className="space-y-2 max-h-60 overflow-auto pr-1">
                    {formData.companions.map((companion, index) => (
                      <div
                        key={index}
                        className="bg-white rounded p-3 border border-neutral-200"
                      >
                        <p className="font-medium text-neutral-800">
                          {companion.name}
                        </p>
                        <p className="text-sm text-neutral-600 break-words">
                          {companion.phoneNumber}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <p className="text-sm text-neutral-500 mb-2">Photo</p>
              {formData.photo && (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-neutral-200">
                  <img
                    src={formData.photo}
                    alt="Visitor"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto py-3 px-4 bg-white border border-neutral-300 text-neutral-700 font-medium rounded-lg transition duration-200 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              disabled={isSubmitting}
            >
              Edit Information
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className={`w-full sm:w-auto py-3 px-4 bg-primary-500 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-white ${
                isSubmitting
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:bg-primary-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Confirm & Submit"
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default VisitorForm;
