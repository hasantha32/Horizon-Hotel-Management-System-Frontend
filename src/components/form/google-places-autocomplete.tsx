import { Autocomplete } from '@react-google-maps/api';
import { GoogleMapLocation } from '@/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Loader from '@/components/ui/loader/loader';
import { MapPin } from '@/components/icons/map-pin';
import useLocation, { locationAtom } from '@/utils/use-location';
import { useAtom } from 'jotai';
import CurrentLocation from '@/components/icons/current-location';

export default function GooglePlacesAutocomplete({
  onChange,
  onChangeCurrentLocation,
  data,
  disabled = false,
  icon = false,
}: {
  onChange?: () => void;
  onChangeCurrentLocation?: () => void;
  data?: GoogleMapLocation;
  disabled?: boolean;
  icon?: boolean;
}) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [
    onLoad,
    onUnmount,
    onPlaceChanged,
    getCurrentLocation,
    isLoaded,
    loadError,
  ] = useLocation({ onChange, onChangeCurrentLocation, setInputValue });

  useEffect(() => {
    const getLocation = data?.formattedAddress;
    setInputValue(getLocation!);
  }, [data]);

  if (loadError) {
    return <div>{t('common:text-map-cant-load')}</div>;
  }

  return isLoaded ? (
    <div className="relative">
      {icon && (
        <div className="absolute top-0 left-0 flex h-12 w-10 items-center justify-center text-gray-400">
          <MapPin className="w-[18px]" />
        </div>
      )}

      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        onUnmount={onUnmount}
        fields={[
          'address_components',
          'geometry.location',
          'formatted_address',
        ]}
        types={['address']}
      >
        <input
          type="text"
          placeholder={t('form:placeholder-search-location')}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`flex h-12 w-full appearance-none items-center rounded border border-border-base text-sm text-heading transition duration-300 ease-in-out  focus:border-accent focus:outline-none focus:ring-0 ${disabled ? 'cursor-not-allowed border-[#D4D8DD] bg-[#EEF1F4]' : ''
            } ${icon ? 'pe-4 ps-9' : 'px-4'}`}
          disabled={disabled}
        />
      </Autocomplete>
      {/* <div className="absolute top-0 right-0 flex h-12 w-12 items-center justify-center text-accent">
        <CurrentLocation className='hover:text-accent cursor-pointer w-5 h-5'
          onClick={() => {
            getCurrentLocation();
            setInputValue(location?.formattedAddress!);
          }}
        />
      </div> */}
    </div>
  ) : (
    <Loader simple={true} className="h-6 w-6" />
  );
}
