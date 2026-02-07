'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import {
    Building2,
    PartyPopper,
    Users,
    TreeDeciduous,
    Home,
    Hotel,
    Utensils,
    Moon,
    Upload,
    X,
    Info,
    Camera,
    Facebook,
    Instagram,
    Mail
} from 'lucide-react';

const categories = [
    { id: 'wedding-hall', icon: Building2 },
    { id: 'event-salon', icon: PartyPopper },
    { id: 'conference-room', icon: Users },
    { id: 'garden-outdoor', icon: TreeDeciduous },
    { id: 'villa', icon: Home },
    { id: 'hotel-ballroom', icon: Hotel },
    { id: 'restaurant', icon: Utensils },
    { id: 'rooftop', icon: Moon },
];

const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naama', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane', 'El M\'Ghair', 'El Meniaa', 'Ouled Djellal', 'Bordj Baji Mokhtar',
    'Béni Abbès', 'Timimoun', 'Touggourt', 'Djanet', 'In Salah', 'In Guezzam'
];

const amenitiesList = [
    'Parking', 'Air Conditioning', 'Sound System', 'Lighting', 'Stage',
    'Kitchen', 'Catering', 'Wi-Fi', 'Wheelchair Access', 'Valet Parking',
    'Dance Floor', 'Bridal Suite', 'Garden', 'Pool', 'Terrace',
];

export default function NewVenuePage() {
    const t = useTranslations('NewVenue');
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        location: '',
        address: '',
        capacity_min: '',
        capacity_max: '',
        price_range_min: '',
        price_range_max: '',
        phone: '',
        whatsapp: '',
        email: '',
        facebook_url: '',
        instagram_url: '',
        amenities: [] as string[],
        images: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const newImages: string[] = [];

        try {
            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('venue-images')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('venue-images')
                    .getPublicUrl(filePath);

                newImages.push(publicUrl);
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading images. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const slug = formData.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);

            const { error } = await supabase.from('venues').insert({
                owner_id: user.id,
                slug: slug,
                title: formData.name,
                name: formData.name,
                description: formData.description,
                category: formData.category,
                location: formData.location,
                address: formData.address,
                capacity_min: parseInt(formData.capacity_min) || 0,
                capacity_max: parseInt(formData.capacity_max) || 0,
                capacity: parseInt(formData.capacity_max) || 0,
                price_min: parseFloat(formData.price_range_min) || 0,
                price_max: parseFloat(formData.price_range_max) || 0,
                price: parseFloat(formData.price_range_min) || 0,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                contact_email: formData.email,
                facebook_url: formData.facebook_url,
                instagram_url: formData.instagram_url,
                amenities: formData.amenities,
                images: formData.images,
                status: 'pending',
            });

            if (error) throw error;

            router.push('/dashboard/venues');
            router.refresh();
        } catch (error: any) {
            console.error('Error submitting venue:', error);
            alert(`Error creating venue: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {t('title')}
                    </h1>
                    <p className="mt-1 text-slate-600">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                                }`}>
                                {s}
                            </div>
                            <span className={`text-sm hidden sm:block ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
                                {s === 1 ? t('steps.basic') : s === 2 ? t('steps.details') : t('steps.contact')}
                            </span>
                            {s < 3 && <div className="w-8 h-0.5 bg-slate-200" />}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-slate-200 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-bold text-slate-900 mb-6">{t('steps.basic')}</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {t('form.name')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Le Grand Salon"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {t('form.category')} *
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {categories.map((cat) => {
                                            const Icon = cat.icon;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setFormData(p => ({ ...p, category: cat.id }))}
                                                    className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all ${formData.category === cat.id
                                                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-500'
                                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                                                        }`}
                                                >
                                                    <Icon className="w-8 h-8 opacity-80" strokeWidth={1.5} />
                                                    <span className="text-sm font-medium">{t(`categories.${cat.id.replace(/-/g, '_')}`)}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {t('form.location')} *
                                    </label>
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="">Select Wilaya</option>
                                        {wilayas.map((w) => (
                                            <option key={w} value={w}>{w}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {t('form.address')}
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Street address, city"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {t('form.description')} *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    // Relaxed validation to help user proceed; ensure backend verifies required fields if needed
                                    disabled={!formData.name}
                                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    {t('buttons.next')}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-slate-200 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-bold text-slate-900 mb-6">{t('steps.details')}</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            {t('form.capacity_min')}
                                        </label>
                                        <input
                                            type="number"
                                            name="capacity_min"
                                            value={formData.capacity_min}
                                            onChange={handleChange}
                                            placeholder="e.g., 50"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            {t('form.capacity_max')}
                                        </label>
                                        <input
                                            type="number"
                                            name="capacity_max"
                                            value={formData.capacity_max}
                                            onChange={handleChange}
                                            placeholder="e.g., 300"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            {t('form.price_min')}
                                        </label>
                                        <input
                                            type="number"
                                            name="price_range_min"
                                            value={formData.price_range_min}
                                            onChange={handleChange}
                                            placeholder="e.g., 50000"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            {t('form.price_max')}
                                        </label>
                                        <input
                                            type="number"
                                            name="price_range_max"
                                            value={formData.price_range_max}
                                            onChange={handleChange}
                                            placeholder="e.g., 150000"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        {t('form.amenities')}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {amenitiesList.map((amenity) => (
                                            <button
                                                key={amenity}
                                                type="button"
                                                onClick={() => handleAmenityToggle(amenity)}
                                                className={`px-3 py-1.5 border rounded-full text-sm transition-all ${formData.amenities.includes(amenity)
                                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                                    }`}
                                            >
                                                {formData.amenities.includes(amenity) && '✓ '}
                                                {amenity}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {t('form.photos')}
                                    </label>

                                    <div className="mb-4 grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                                                <img src={img} alt={`Venue ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-100 transition-colors relative">
                                        {uploading ? (
                                            <div className="flex flex-col items-center">
                                                <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mb-2" />
                                                <p className="text-sm text-slate-600">Uploading...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-3xl mb-2 flex justify-center text-slate-400">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <p className="text-sm text-slate-600">
                                                    {t('form.upload_text')}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {t('form.upload_hint')}
                                                </p>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-6 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    {t('buttons.prev')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    {t('buttons.next')}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Contact */}
                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-slate-200 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-bold text-slate-900 mb-6">{t('steps.contact')}</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            {t('form.phone')} *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., 0555 123 456"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            {t('form.whatsapp')}
                                        </label>
                                        <input
                                            type="tel"
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleChange}
                                            placeholder="e.g., 0555 123 456"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {t('form.email')}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="e.g., contact@venue.dz"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-200">
                                    <h3 className="text-sm font-medium text-slate-700 mb-4">{t('form.social')}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl shrink-0 text-slate-400">
                                                <Facebook className="w-6 h-6" />
                                            </span>
                                            <input
                                                type="url"
                                                name="facebook_url"
                                                value={formData.facebook_url}
                                                onChange={handleChange}
                                                placeholder="Facebook page URL"
                                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl shrink-0 text-slate-400">
                                                <Instagram className="w-6 h-6" />
                                            </span>
                                            <input
                                                type="url"
                                                name="instagram_url"
                                                value={formData.instagram_url}
                                                onChange={handleChange}
                                                placeholder="Instagram profile URL"
                                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-6 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    {t('buttons.prev')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.phone}
                                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            {t('buttons.submitting')}
                                        </>
                                    ) : (
                                        t('buttons.submit')
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </form>

                {/* Info Notice */}
                <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-primary-600 shrink-0">
                            <Info className="w-6 h-6" />
                        </span>
                        <div className="text-sm text-primary-800">
                            <p className="font-medium mb-1">What happens next?</p>
                            <p>After submitting, your venue will be reviewed by our team. This usually takes 24-48 hours. Once approved, your venue will be visible to thousands of potential customers!</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
