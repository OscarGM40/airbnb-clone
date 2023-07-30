"use client";
import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../shared/Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
// Si usaramos el import estático de abajo no se va a re-renderizar,
// import Map from "../shared/Map";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}
const RentModal = () => {
  const rentModal = useRentModal();
  const router = useRouter();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  // fijate que fácil es crear un Observer sobre un campo con react-hook-forms
  const category = watch("category");
  const location = watch("location");
  // está persistiendo entre UIs/steps ? <- lo está haciendo mientras viva este componente.Desde luego es una aproximación super-correcta
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc"); // devolverá el defaultValue la primera vez, asinto

  // realmente sabemos que el Mapa depende del cambio de location, asi que no es innecesaria.Fijate que facil es hacer un import dinámico en Next,suputamadre,que prozh
  const Map = useMemo(
    () =>
      dynamic(() => import("../shared/Map"), {
        ssr: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location],
  );

  const setCustomValue = (id: string, value: any) => {
    // setValue es de ellos,de react-hook-forms.entiendo que establece un valor en caliente(y por ello ponemos el dirty y el touch a true)La puta ostia
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };
  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) return onNext();

    setIsLoading(true);
    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing created!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch((error) => toast.error(`Something went wrong: ${error}`))
      .finally(() => setIsLoading(false));
  };
  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyContent = (
    <div className=" flex flex-col gap-8 ">
      <Heading title="Which of these best describes your place?" subtitle="Pick a category" />
      <div
        className="
         grid
         grid-cols-1
         md:grid-cols-2
         gap-3
         max-h-[50vh]
         overflow-y-auto
         "
      >
        {categories.map((cat) => (
          <div key={cat.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === cat.label}
              label={cat.label}
              icon={cat.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Where is your place located?" subtitle="Help guests find you!" />
        <CountrySelect
          // fijate como ha puesto un watcher en location para el value
          value={location}
          // super interesante esta abstracción del pollo
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        {/* amenities= comodidades,servicios,instalaciones */}
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />
        <Counter
          title="Guests"
          subtitle="How many guests do you allow?"
          value={guestCount}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you have?"
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
          value={bathroomCount}
          onChange={(value) => setCustomValue("bathroomCount", value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Addd a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload value={imageSrc} onChange={(value) => setCustomValue("imageSrc", value)} />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Now, set your price" subtitle="How much do you charge per night?" />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
      </div>
    );
  }

  return (
    <Modal
      title="Airbnb your home!"
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      // de momento hardcodeamos que vaya hacia alante
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    />
  );
};
export default RentModal;
