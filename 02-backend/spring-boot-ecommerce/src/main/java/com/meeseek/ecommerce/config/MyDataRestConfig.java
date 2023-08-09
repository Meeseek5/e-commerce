package com.meeseek.ecommerce.config;

import com.meeseek.ecommerce.entity.Product;
import com.meeseek.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        // 拒絕 http PUT, POST, DELETE, PATCH 方法改動 Product 資料
        disableHttpMethods(Product.class, config, theUnsupportedActions);

        // 拒絕 http PUT, POST, DELETE, PATCH 方法改動 ProductCategory 資料
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);

        // 呼叫公開 entity id 方法
        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        // 從 entity manager 得到 entities
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // 建立 List 存 entity types
        List<Class> entityClasses = new ArrayList<>();

        // 將每個 entity type 轉成 java type 放入 List
        for(EntityType tempEntityType: entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }


        Class[] domainTypes = entityClasses.toArray(new Class[0]); // new Class[0] -> 相比 list.size() 有效率
        config.exposeIdsFor(domainTypes);

    }


}
