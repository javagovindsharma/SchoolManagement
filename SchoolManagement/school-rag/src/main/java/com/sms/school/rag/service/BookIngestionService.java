package com.sms.school.rag.service;


import lombok.AllArgsConstructor;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BookIngestionService {

    private final VectorStore vectorStore;

    public void ingestBook(Resource bookPdf, String bookName, String subject) {
          var chunks= new TokenTextSplitter(500,100,5,1000,true)
                  .apply(new TikaDocumentReader(bookPdf).get());
          chunks.forEach( doc-> {
                doc.getMetadata().put("book",bookName);
                doc.getMetadata().put("subject",subject);
            }
          );
          vectorStore.add(chunks);
    }
}
