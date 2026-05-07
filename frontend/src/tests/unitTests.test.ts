// @vitest-environment happy-dom

import { describe, vi, it, expect, afterEach, beforeEach } from 'vitest';
import { pay } from '../helpers/utils/pay';
import { MAX_FILES_GUESTS } from '../lib/constants';
import { handleUploaderFiles } from '../pages/HomePage/handleUploaderFiles';
import { handleFiles } from '../helpers/utils/handleFiles';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/server';
import toast from 'react-hot-toast';

describe('Various unit tests', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const uploadingFiles = [
    new File(['something'], 'image.png', { type: 'image/png' }),
    new File(['something2'], 'image2.png', { type: 'image/png' }),
    new File(['something3'], 'image3.jpg', { type: 'image/jpeg' }),
    new File(['something4'], 'image4.gif', { type: 'image/gif' }),
    new File(['something5'], 'image5.png', { type: 'image/png' }),
    new File(['something6'], 'image6.png', { type: 'image/png' }),
    new File(['something7'], 'image7.png', { type: 'image/png' }),
  ];

  it('Navigates a user to the required url after clicking Pay (logged in user)', async () => {
    await pay('payment', 'price_123');
    expect(window.location.href).toBe('https://stripetesturl.com/');
  });

  it('Throws a toast to a user after clicking Pay (guest user)', async () => {
    vi.spyOn(toast, "error");
    server.use(
      http.post("http://localhost:3000/api/server/create-checkout-session", async () => {
        return HttpResponse.json({ error: 'Something went wrong' }, { status: 500 })
      })
    )
    await pay('payment', 'price_123');
    expect(toast.error).toHaveBeenCalled();
  });

  it('Lets an uploader upload a maximum amount of MAX_FILES (guest)', async () => {
    let files: File[] = [];
    const setFiles = vi.fn((updater) => {
      files = typeof updater === 'function' ? updater(files) : updater;
    });
    const maxUploads = MAX_FILES_GUESTS;
    handleUploaderFiles({
      setFiles,
      files,
      maxUploads,
      filesFromDataTransfer: uploadingFiles as unknown as FileList,
    });
    expect(files).toHaveLength(MAX_FILES_GUESTS);
  });

  it('handleFiles sets processed files to the required files', async () => {
    let files: File[] = [];
    const setFiles = vi.fn((updater) => {
      files = typeof updater === 'function' ? updater(files) : updater;
    });

    await handleFiles(uploadingFiles, 'image/jpeg', setFiles, 'testFingerprint');

    expect(files).toHaveLength(uploadingFiles.length);
    expect(setFiles).toBeCalledTimes(uploadingFiles.length);
    expect(files[0].name).toBe('image.jpeg');
  });

  it('Should not process files if user has 0 credits.', async () => {
    server.use(
      http.post('http://localhost:3000/api/server/processFile', () => {
        return HttpResponse.json(
          {
            error:
              "User doesn't have enough credits for converting [convertImage]",
          },
          { status: 400 },
        );
      }),
    );

    const mockSetProcessedFiles = vi.fn();
    const mockFiles = [
      new File(['content'], 'image.png', { type: 'image/png' }),
    ];

    await handleFiles(
      mockFiles,
      'image/png',
      mockSetProcessedFiles,
      'test-fingerprint',
    );

    expect(mockSetProcessedFiles).not.toHaveBeenCalled();
  });
});
