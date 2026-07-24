import { useState } from "react";

const emptyForm = { fullName: "", phone: "", address: "", city: "", postalCode: "", country: "India" };

const AddressForm = ({ initialData, onSave, onCancel }) => {
  const [form, setForm] = useState(initialData || emptyForm);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <input className="form-input" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
      <input className="form-input" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
      <input className="form-input" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
      <div className="address-form-row">
        <input className="form-input" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input className="form-input" name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} required />
      </div>
      <input className="form-input" name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
      <div className="address-form-actions">
        <button className="btn btn-primary" type="submit">Save Address</button>
        <button className="btn btn-outline" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default AddressForm;