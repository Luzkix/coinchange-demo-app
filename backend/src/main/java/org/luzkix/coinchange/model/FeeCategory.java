package org.luzkix.coinchange.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "fee_categories")
public class FeeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Convert(converter = FeeCategoryEnumConverter.class)
    @Column(nullable = false, unique = true, length = 1)
    private FeeCategoryEnum category;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal fee;

    public enum FeeCategoryEnum {
        A, B, C, D, E, F
    }

    @Converter(autoApply = true)
    public static class FeeCategoryEnumConverter implements AttributeConverter<FeeCategoryEnum, String> {
        @Override
        public String convertToDatabaseColumn(FeeCategoryEnum attribute) {
            return attribute != null ? attribute.name() : null;
        }

        @Override
        public FeeCategoryEnum convertToEntityAttribute(String dbData) {
            return dbData != null ? FeeCategoryEnum.valueOf(dbData) : null;
        }
    }

}
