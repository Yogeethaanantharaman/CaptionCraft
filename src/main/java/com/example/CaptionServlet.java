package com.example;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.coobird.thumbnailator.Thumbnails;
import java.io.ByteArrayOutputStream;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

@WebServlet("/CaptionServlet")
@MultipartConfig(
        maxFileSize = 10 * 1024 * 1024,
        maxRequestSize = 15 * 1024 * 1024
)
public class CaptionServlet extends HttpServlet {

    /*
     * IMPORTANT:
     * Put your NEW Gemini API key here.
     *
     * Do NOT put quotes around the key.
     */
    private static final String GEMINI_API_KEY =
    System.getenv("GEMINI_API_KEY");

    /*
     * Current Gemini REST endpoint.
     */
    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";


    private final ObjectMapper mapper =
            new ObjectMapper();

    private final HttpClient client =
            HttpClient.newHttpClient();


    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/plain; charset=UTF-8");
        String action =
            request.getParameter("action");

        /*
         * =====================================
         * TRANSLATION REQUEST
         * =====================================
         */

        if ("translate".equalsIgnoreCase(action)) {

        handleTranslation(
                request,
                response
        );

        return;
        }

        /*
         * =====================================
         * NORMAL CAPTION GENERATION
         * =====================================
         */

        Part imagePart =
                request.getPart("image");


        if (imagePart == null) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                    "No image was uploaded."
            );

            return;
        }


        String platform =
                request.getParameter("platform");


        String captionStyle =
                request.getParameter("captionStyle");

        String captionLanguage =
                request.getParameter("captionLanguage");

        String captionLength =
                request.getParameter("captionLength");


        if (platform == null ||
                platform.isBlank()) {

            platform = "Instagram";
        }


        if (captionStyle == null ||
                captionStyle.isBlank()) {

            captionStyle = "Creative";
        }

        if (captionLanguage == null ||
                captionLanguage.isBlank()) {

            captionLanguage = "English";
        }

        if (captionLength == null ||
                captionLength.isBlank()) {

            captionLength = "Medium";
        }


        try {

            String caption =
                    generateCaption(
                            imagePart,
                            platform,
                            captionStyle,
                            captionLanguage,
                            captionLength
                );


            response.setStatus(
                    HttpServletResponse.SC_OK
            );

            response.getWriter().write(
                    caption
            );

        }
        catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_BAD_GATEWAY
            );

            response.getWriter().write(
                    "Gemini API error: " +
                    e.getMessage()
            );
        }
    }


    /*
     * =====================================
     * GENERATE CAPTION
     * =====================================
     */

    private String generateCaption(
            Part imagePart,
            String platform,
            String style,
            String language,
            String length)
            throws Exception {
        

        /*
         * Read image
         */

       byte[] imageBytes;

        try (InputStream input = imagePart.getInputStream();
                ByteArrayOutputStream output = new ByteArrayOutputStream()) {

        Thumbnails.of(input)
            .size(1280, 1280)
            .outputFormat("jpg")
            .outputQuality(0.80)
            .toOutputStream(output);

        imageBytes = output.toByteArray();
        }

        /*
         * Convert image to Base64
         */

        String base64Image =
                Base64.getEncoder()
                        .encodeToString(
                                imageBytes
                        );


        String mimeType =
                "image/jpeg";

        String prompt =
        "You are CaptionCraft, an AI social media caption generator.\n\n" +

        "Analyze the uploaded image and create ONE social media caption.\n\n" +

        "PLATFORM: " + platform + "\n" +
        "STYLE: " + style + "\n" +
        "LANGUAGE: " + language + "\n" +
        "LENGTH: " + length + "\n\n" +

        "RULES:\n" +
        "1. Return ONLY the caption and hashtags.\n" +
        "2. Write the caption completely in the selected language.\n" +
        "3. Generate 5 to 10 relevant hashtags along with the caption.\n" +
        "4. Write the hashtags in the selected language whenever possible.\n" +
        "5. Every hashtag must start with #.\n" +
        "6. Do not provide multiple captions.\n" +
        "7. Do not explain your answer.\n" +
        "8. Keep the caption suitable for the selected platform.\n" +
        "9. Keep brand names, usernames and proper names unchanged when appropriate.\n" +
        "10. If the selected language is Arabic, write the caption in Arabic script and generate Arabic hashtags in Arabic script.\n" +
        "11. Do not generate English hashtags when Arabic hashtags can be naturally created.\n\n" +

        "Create the caption and hashtags now.";



        /*
         * =====================================
         * JSON REQUEST
         * =====================================
         */

       String json =
        "{"
        + "\"contents\":[{"
        + "\"parts\":["
        + "{"
        + "\"text\":"
        + mapper.writeValueAsString(prompt)
        + "},"
        + "{"
        + "\"inline_data\":{"
        + "\"mime_type\":"
        + mapper.writeValueAsString(mimeType)
        + ","
        + "\"data\":"
        + mapper.writeValueAsString(base64Image)
        + "}"
        + "}"
        + "]"
        + "}],"

        + "\"generationConfig\":{"
        + "\"thinkingConfig\":{"
        + "\"thinkingLevel\":\"low\""
        + "}"
        + "}"

        + "}";


        return callGemini(json);
    }


    /*
     * =====================================
     * TRANSLATION
     * =====================================
     */

    private void handleTranslation(
            HttpServletRequest request,
            HttpServletResponse response)
            throws IOException {


        String caption =
                request.getParameter("caption");


        String language =
                request.getParameter("language");


        if (caption == null ||
                caption.isBlank()) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                    "Caption is missing."
            );

            return;
        }


        if (language == null ||
                language.isBlank()) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                    "Language is missing."
            );

            return;
        }


        /*
         * Only allow the languages
         * offered by our frontend.
         */

        if (!isSupportedLanguage(language)) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                    "Unsupported translation language."
            );

            return;
        }


        try {

            String translated =
                    translateCaption(
                            caption,
                            language
                    );


            response.setStatus(
                    HttpServletResponse.SC_OK
            );

            response.getWriter().write(
                    translated
            );

        }
        catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_BAD_GATEWAY
            );

            response.getWriter().write(
                    "Translation error: " +
                    e.getMessage()
            );
        }
    }


    /*
     * =====================================
     * TRANSLATE CAPTION USING GEMINI
     * =====================================
     */

    private String translateCaption(
            String caption,
            String language)
            throws Exception {


        String prompt =
        "You are a multilingual social media caption translator.\n\n" +

        "Translate the following social media caption into " +
        language + ".\n\n" +

        "Rules:\n" +
        "1. Preserve the original meaning.\n" +
        "2. Preserve the original tone and emotion.\n" +
        "3. Keep all emojis unchanged.\n" +
        "4. Translate the caption naturally into the target language.\n" +
        "5. Translate the hashtags into the target language.\n" +
        "6. Do NOT simply copy the original English hashtags.\n" +
        "7. Create natural, meaningful and relevant hashtags for the target language.\n" +
        "8. Every hashtag must start with #.\n" +
        "9. Hashtags should be related to the caption and its topic.\n" +
        "10. Keep brand names or proper names unchanged when translation would make them incorrect.\n" +
        "11. Do not explain the translation.\n" +
        "12. Return only the translated caption and hashtags.\n\n" +

        "Target language: " + language + "\n\n" +

        "Original caption:\n" +
        caption;


        String json =
                "{"
                + "\"generationConfig\":{"
                + "\"thinkingConfig\":{"
                + "\"thinkingLevel\":\"low\""
                + "}"
                + "},"
                + "\"contents\":[{"
                + "\"parts\":[{"
                + "\"text\":"
                + mapper.writeValueAsString(prompt)
                + "}]"
                + "}]"
                + "}";


        return callGemini(json);
    }


    /*
     * =====================================
     * GEMINI API CALL
     * =====================================
     */

    private String callGemini(
            String json)
            throws Exception {


       if (GEMINI_API_KEY == null ||
        GEMINI_API_KEY.isBlank()) {

        throw new Exception(
            "Gemini API key has not been configured."
        );
}


        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(
                                URI.create(
                                        GEMINI_URL
                                )
                        )
                        .header(
                                "Content-Type",
                                "application/json"
                        )
                        .header(
                                "x-goog-api-key",
                                GEMINI_API_KEY
                        )
                        .POST(
                                HttpRequest.BodyPublishers
                                        .ofString(json)
                        )
                        .build();


        HttpResponse<String> result =
                client.send(
                        request,
                        HttpResponse.BodyHandlers
                                .ofString()
                );


        System.out.println(
                "Gemini HTTP Status: " +
                result.statusCode()
        );


        System.out.println(
                "Gemini Response:"
        );

        System.out.println(
                result.body()
        );


        /*
         * =====================================
         * ERROR
         * =====================================
         */

        if (result.statusCode() < 200 ||
                result.statusCode() >= 300) {

            throw new Exception(
                    "Gemini HTTP " +
                    result.statusCode() +
                    ": " +
                    result.body()
            );
        }


        /*
         * =====================================
         * READ GEMINI RESPONSE
         * =====================================
         */

        JsonNode root =
                mapper.readTree(
                        result.body()
                );


        JsonNode textNode =
                root.path("candidates")
                        .path(0)
                        .path("content")
                        .path("parts")
                        .path(0)
                        .path("text");


        if (textNode.isMissingNode() ||
                textNode.isNull()) {

            throw new Exception(
                    "Gemini returned no text.\n" +
                    result.body()
            );
        }


        return textNode
                .asText()
                .trim();
    }


    /*
     * =====================================
     * SUPPORTED LANGUAGES
     * =====================================
     */

    private boolean isSupportedLanguage(
            String language) {

        return language.equalsIgnoreCase("Tamil")
                || language.equalsIgnoreCase("English")
                || language.equalsIgnoreCase("Arabic")
                || language.equalsIgnoreCase("Spanish")
                || language.equalsIgnoreCase("German")
                || language.equalsIgnoreCase("Japanese")
                || language.equalsIgnoreCase("Korean")
                || language.equalsIgnoreCase("French");
        }
}
   

      
 