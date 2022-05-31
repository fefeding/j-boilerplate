import { onMounted, Ref, ref, watch } from 'vue';
import { loadJs } from '@/base/loadJs';
import router from '@/adapter/router';
import * as monitor from '@/adapter/monitor';

export default function ({ type = 'canvas', url = '' }) {
    monitor.logAll('pdf init', type, url);
    let pdfViewer: any = null;
    let pdfLinkService: any = null;
    let loadingTask: any = null;
    let loading: Ref<boolean> = ref(false);

    let container: Ref<any> = ref(null);
    let currentScale: Ref<string> = ref('page-width');

    let CMAP_URL: string = '';

    const onPagesInit = ({ source }) => {
        source.currentScaleValue = currentScale.value;
    };
    const pdfLibInit = async () => {
        try {
            let pdfjsLib = (window as any).pdfjsLib;
            if (!pdfjsLib) {
                monitor.logAll('pdf.min.js load start');
                await loadJs(`//jtcospublic.ciccten.com/public/pdfjs/2.7.570/build/pdf.min.js`);
                monitor.logAll('pdf.min.js load end');
                pdfjsLib = (window as any).pdfjsLib;
            }
            let pdfjsViewer = (window as any).pdfjsViewer;
            if (!pdfjsViewer) {
                monitor.logAll('pdf_viewer.js load start');
                await loadJs('//jtcospublic.ciccten.com/public/pdfjs/2.7.570/web/pdf_viewer.js');
                monitor.logAll('pdf_viewer.js load end');
                pdfjsViewer = (window as any).pdfjsViewer;
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//jtcospublic.ciccten.com/public/pdfjs/2.7.570/build/pdf.worker.min.js`;
            }
            const eventBus = new pdfjsViewer.EventBus();
            // (Optionally) enable hyperlinks within PDF files.
            pdfLinkService = new pdfjsViewer.PDFLinkService({
                eventBus: eventBus,
            });

            pdfViewer = new pdfjsViewer.PDFViewer({
                container: container.value,
                eventBus: eventBus,
                linkService: pdfLinkService,
                renderer: type,
                textLayerMode: 0,
                downloadManager: new pdfjsViewer.DownloadManager({}),
                enableWebGL: true,
            });

            pdfLinkService.setViewer(pdfViewer);

            eventBus.on('pagesinit', onPagesInit);
        } catch (error) {
            monitor.error(error);
        }
    };

    const renderPdf = () => {
        if (!url) {
            return;
        }
        // Loading document.
        if (pdfViewer === null || pdfLinkService === null) {
            return;
        }
        if (loadingTask !== null) {
            loadingTask.destroy();
            loadingTask = null;
            loading.value = false;
        }
        loading.value = true;
        loadingTask = (window as any).pdfjsLib.getDocument({
            cMapUrl: CMAP_URL,
            cMapPacked: true,
            url: router.getProxy(url),
        });
        return loadingTask.promise
            .then(pdfDocument => {
                if (pdfDocument.loadingTask.destroyed || !url) {
                    return;
                }
                pdfViewer.setDocument(pdfDocument);
                pdfLinkService.setDocument(pdfDocument, null);
                loadingTask = null;
                loading.value = false;
            })
            .catch(error => {
                monitor.error(error);
            });
    };

    onMounted(() => {
        pdfLibInit().then(() => {
            renderPdf();
        });
    });

    watch(
        () => url,
        () => {
            // 如果存在pdfViewer则取消渲染
            if (pdfViewer) {
                pdfViewer._cancelRendering();
            }
            renderPdf();
        }
    );

    return {
        loading,
        container,
    };
}
