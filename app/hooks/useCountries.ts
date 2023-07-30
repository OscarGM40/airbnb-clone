import countries from "world-countries"; //fijate que el paquete ya viene con el tipado, perfect

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

const useCountries = () => {
  // formattedCountries es la referencia a la funcion,luego getAll hay que ejecutarla
  const getAll = () => formattedCountries;

  const getByValue = (value: string) => formattedCountries.find((item) => item.value === value);

  return {
    getAll,
    getByValue,
  };
};

export default useCountries;
