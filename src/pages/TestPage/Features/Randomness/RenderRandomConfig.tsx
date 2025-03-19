import { Form } from "react-bootstrap";
import { INumericRandomConfig, ITestNumericRandomConfig, ITextRandomConfig, RandomConfig } from "../../Models/RandomConfigModels";
import { useCallback } from "react";
import { DebouncedTextInput } from "../../../../components/FormElements/DebouncedTextInput";

 //returns form options for selected randomness
 export const renderRandomConfig = (key: string, randomConfig: RandomConfig | undefined, handleChange: (key: string, value: any) => void) => {
    if (!randomConfig) return null;  // Pokud není náhodnost aktivovaná, nic se nezobrazí
    console.log(randomConfig)

    switch (randomConfig.type) {
      case 'numeric':
        return (
          <>
            <Form.Group controlId={`${key}-min`}>
              <Form.Label>Min Value:</Form.Label>
              <Form.Control
                type="number"
                value={(randomConfig as INumericRandomConfig).min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(`${key}Random.min`, parseFloat(e.target.value))
                }
              />
            </Form.Group>
            <Form.Group controlId={`${key}-max`}>
              <Form.Label>Max Value:</Form.Label>
              <Form.Control
                type="number"
                value={(randomConfig as INumericRandomConfig).max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(`${key}Random.max`, parseFloat(e.target.value))
                }
              />
            </Form.Group>
            <Form.Group controlId={`${key}-step`}>
              <Form.Label>Step (Optional):</Form.Label>
              <Form.Control
                type="number"
                value={(randomConfig as INumericRandomConfig).step || 1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(`${key}Random.step`, parseFloat(e.target.value))
                }
              />
            </Form.Group>
          </>
        );

      case "numeric-test":
        return (
          <>
            <Form.Group controlId={`${key}-min`}>
              <Form.Label>Min Value:</Form.Label>
              <Form.Control
                type="number"
                value={(randomConfig as ITestNumericRandomConfig).min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(`${key}Random.min`, parseFloat(e.target.value))
                }
              />
            </Form.Group>
            <Form.Group controlId={`${key}-max`}>
              <Form.Label>Max Value:</Form.Label>
              <Form.Control
                type="number"
                value={(randomConfig as ITestNumericRandomConfig).max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(`${key}Random.max`, parseFloat(e.target.value))
                }
              />
            </Form.Group>
          </>

        )
      case 'text':
        const handleDebouncedChange = useCallback((value: string) => {
          const newOptions = value ? value.split(',').map(option => option.trim()).filter(option => option !== '') : [];
          handleChange(`${key}Random.options`, newOptions); // Volání handleChange s novými options
        }, [key, handleChange]); // Závislosti zůstávají stejné, pokud se nemění key nebo handleChange

        return (
          <>
            <Form.Group controlId={`${key}-options`}>
              <Form.Label>Options:</Form.Label>

              <DebouncedTextInput
                onChange={handleDebouncedChange} // Použití stabilizované verze onChange
                value={(randomConfig as ITextRandomConfig).options.join(', ')} // Zobrazení pole jako čárkou oddělený řetězec
              />

            </Form.Group>
          </>
        );
      default:
        return null;
    }
  };