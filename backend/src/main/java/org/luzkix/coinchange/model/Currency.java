package org.luzkix.coinchange.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "currencies")
public class Currency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String code;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 10)
    private String color;

    @Column(nullable = false)
    private boolean isActive;

    @Convert(converter = CurrencyTypeEnumConverter.class) //automatically converts enum into 'F'/'C' values and vice versa
    @Column(nullable = false, length = 1)
    private CurrencyTypeEnum type;

    public enum CurrencyTypeEnum {
        FIAT("F"),
        CRYPTO("C");

        private final String typeValue;

        CurrencyTypeEnum(String typeValue) {
            this.typeValue = typeValue;
        }

        public String getTypeValue() {
            return typeValue;
        }

        public static CurrencyTypeEnum fromValue(String value) {
            for (CurrencyTypeEnum type : values()) {
                if (type.typeValue.equals(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown CurrencyTypeEnum value: " + value);
        }
    }

    @Converter(autoApply = true)
    public static class CurrencyTypeEnumConverter implements AttributeConverter<CurrencyTypeEnum, String> {
        @Override
        public String convertToDatabaseColumn(CurrencyTypeEnum attribute) {
            return attribute != null ? attribute.getTypeValue() : null;
        }

        @Override
        public CurrencyTypeEnum convertToEntityAttribute(String dbData) {
            return dbData != null ? CurrencyTypeEnum.fromValue(dbData) : null;
        }
    }
}
