import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: { value: true, message: 'Arquivo obrigatório' },
      validate: {
        lessThan10MB: value =>
          value[0]?.size <= 1_048_576 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: value =>
          ['image/png', 'image/jpeg', 'image/gif'].includes(value[0]?.type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: { value: true, message: 'Título obrigatório' },
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
    },
    description: {
      required: { value: true, message: 'Descrição obrigatória' },
      maxLength: { value: 65, message: 'Máximo de 65 caracteres' },
    },
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (image: { url: string; title: string; description: string }) =>
      api.post('/api/images', image),
    {
      onSuccess: () => queryClient.invalidateQueries('images'),
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          position: 'bottom',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });

        return;
      }

      mutation.mutateAsync({
        url: imageUrl,
        title: data.title as string,
        description: data.description as string,
      });

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        position: 'bottom',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        position: 'bottom',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      closeModal();
      reset();
      setImageUrl('');
      setLocalImageUrl('');
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name="Imagem"
          onChange={async e => {
            setLocalImageUrl(e.target.value);
          }}
          {...register('image', { ...formValidations.image })}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="Título"
          {...register('title', { ...formValidations.title })}
          error={errors.imageTitle}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="Descrição"
          {...register('description', { ...formValidations.description })}
          error={errors.imageDescription}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
