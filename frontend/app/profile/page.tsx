"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getProfile, logout } from "@/store/slices/authSlice";
import { fetchMyOrders } from "@/store/slices/orderSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const { user, loading, token } = useAppSelector((state) => state.auth);
  const { items: orders, loading: ordersLoading } = useAppSelector(
    (state) => state.orders,
  );

  const toggleOrderDetails = (id: string) => {
    setSelectedOrderId(selectedOrderId === id ? null : id);
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      dispatch(getProfile());
      dispatch(fetchMyOrders());
    }
  }, [token, dispatch, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (loading)
    return (
      <div className="py-40 text-center uppercase text-[10px] tracking-widest">
        Loading Account...
      </div>
    );
  if (!user) return null;

  return (
    <section className="mt-24 pb-20 bg-white min-h-screen">
      <div className="max-w-[1200px] pt-20 mx-auto px-6">
        <header className="border-b border-gray-100 pb-10 mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif text-[#4a2c2a] mb-2">
              My Account
            </h1>
            <p className="text-[11px] uppercase text-gray-500 tracking-[0.2em] opacity-50">
              Manage your orders and details
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:underline"
          >
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* PERSONAL & SHIPPING DETAILS */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#FBFBFB] p-8 rounded-sm border border-gray-50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest opacity-40">
                  Account Details
                </h3>
                <Link
                  href="/profile/edit"
                  className="text-[9px] font-bold text-gray-500 uppercase border-b border-[#4a2c2a] pb-0.5"
                >
                  Edit
                </Link>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-black opacity-30 mb-1">
                      Full Name
                    </label>
                    <p className="text-sm font-medium text-[#4a2c2a]">
                      {user.full_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-black opacity-30 mb-1">
                      Email Address
                    </label>
                    <p className="text-sm font-medium text-[#4a2c2a]">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-black opacity-30 mb-1">
                      Phone
                    </label>
                    <p className="text-sm font-medium text-[#4a2c2a]">
                      {user.phone_number || "Not provided"}
                    </p>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Shipping Info */}
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-black opacity-30 mb-2">
                    Primary Shipping Address
                  </label>
                  {user.address_line1 ? (
                    <div className="text-sm text-[#4a2c2a] leading-relaxed">
                      <p>{user.address_line1}</p>
                      {user.address_line2 && <p>{user.address_line2}</p>}
                      <p>{user.city}</p>
                      <p className="font-bold uppercase tracking-wider">
                        {user.postcode}
                      </p>
                      <p>{user.country}</p>
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-400">
                      No address saved.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ORDER HISTORY */}
          <div className="lg:col-span-2">
  <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6 opacity-40">
    Recent Orders
  </h3>

  {ordersLoading ? (
    <div className="py-10 text-center uppercase text-[10px] tracking-widest opacity-50">
      Fetching your ledger...
    </div>
  ) : orders && orders.length > 0 ? (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = selectedOrderId === order.id;
        
        return (
          <div 
            key={order.id} 
            className={`border border-gray-100 rounded-sm overflow-hidden transition-all ${
              isExpanded ? 'ring-1 ring-[#4a2c2a]' : 'hover:bg-gray-50'
            }`}
          >
            {/* Main Row */}
            <div 
              className="p-6 flex justify-between items-center cursor-pointer"
              onClick={() => toggleOrderDetails(order.id)}
            >
              <div>
                <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">
                  Order #{order.id.slice(-8)}
                </p>
                <p className="text-sm font-serif text-[#4a2c2a]">
                  {new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right flex items-center gap-6">
                <div>
                  <p className="text-sm font-bold text-[#4a2c2a] mb-1">
                    £{Number(order.total_amount).toFixed(2)}
                  </p>
                  <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
                {/* Simple arrow indicator */}
                <svg 
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Expanded Content (Items) */}
            
          </div>
        );
      })}
    </div>
  ) : (
    <div className="border border-dashed border-gray-200 py-20 text-center rounded-sm">
      <p className="text-xs italic text-gray-400">You haven&apos;t placed any orders yet.</p>
      <button 
        onClick={() => router.push('/products')}
        className="mt-4 bg-[#4a2c2a] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Browse Collection
      </button>
    </div>
  )}
</div>
        </div>
      </div>
    </section>
  );
}
