"use client";

import React from "react";

interface ProfileTabProps {
  profileForm: {
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    countryCode: string;
    stateCode: string;
    province: string;
    postcode: string;
  };
  setProfileForm: React.Dispatch<React.SetStateAction<any>>;
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>;
  countries: any[];
  states: any[];
  cities: any[];
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  profileForm,
  setProfileForm,
  handleUpdateProfile,
  countries,
  states,
  cities,
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Profile</h3>
      <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  phone: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Address
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
            value={profileForm.address}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                address: e.target.value,
              })
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Country
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all appearance-none cursor-pointer"
              value={profileForm.countryCode}
              onChange={(e) => {
                const country = countries.find(
                  (c: any) => c.isoCode === e.target.value,
                );
                setProfileForm({
                  ...profileForm,
                  countryCode: e.target.value,
                  country: country?.name || "",
                  stateCode: "",
                  city: "",
                });
              }}
            >
              <option value="">Select Country...</option>
              {countries.map((c: any) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Province / State
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all appearance-none cursor-pointer"
              value={profileForm.stateCode}
              onChange={(e) => {
                const state = states.find(
                  (s: any) => s.isoCode === e.target.value,
                );
                setProfileForm({
                  ...profileForm,
                  stateCode: e.target.value,
                  province: state?.name || "",
                  city: "",
                });
              }}
              disabled={!profileForm.countryCode}
            >
              <option value="">Select...</option>
              {states.map((s: any) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              City
            </label>
            {cities.length > 0 ? (
              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all appearance-none cursor-pointer"
                value={profileForm.city}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    city: e.target.value,
                  })
                }
                disabled={!profileForm.stateCode}
              >
                <option value="">Select...</option>
                {cities.map((c: any) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all"
                value={profileForm.city}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    city: e.target.value,
                  })
                }
                disabled={!profileForm.stateCode}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Postcode
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all"
              value={profileForm.postcode}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  postcode: e.target.value,
                })
              }
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileTab;
