---
title: excelize 库简介
description: 简单介绍一个excelize库的使用方式
date: 2023-02-24
slug: 工具
# image: Snipaste_2023-02-13_18-16-10.png
categories:
  - go
  - 工具开发
  - excelize
---

#### 背景

从表格导入一些用户数据
顺手开发了这些工具。
本文的前提是了解了基本函数的使用方法，因为有中文文档就不再赘述
[excelize 文档地址](https://xuri.me/excelize/zh-hans/)

#### 适用场景

任何二维表格都可以用这种方式做统计

#### 思路简述

找到一个表格的边界，在表格范围内的内容遍历并根据参数按行列进行读取

```go
var rwM sync.RWMutex // 读写锁
var chMap = map[string]int{
	"A": 1, "B": 2, "C": 3, "D": 4, "E": 5,
	"F": 6, "G": 7, "H": 8, "I": 9, "J": 10,
	"K": 11, "L": 12, "M": 13, "N": 14, "O": 15,
	"P": 16, "Q": 17, "R": 18, "S": 19, "T": 20,
	"U": 21, "V": 22, "W": 23, "X": 24, "Y": 25,
	"Z": 26,
}// 枚举
var chArr = charArr{
	"A", "B", "C", "D", "E",
	"F", "G", "H", "I", "J",
	"K", "L", "M", "N", "O",
	"P", "Q", "R", "S", "T",
	"U", "V", "W", "X", "Y",
	"Z",
}

func (c *charArr) Translate(str string) Point {
	strRunes := []rune(str)
	colArr := make([]rune, 0)
	rowArr := make([]rune, 0)
	for _, strRune := range strRunes {
		switch strRune > 64 {
		case false:
			rowArr = append(rowArr, strRune)
		case true:
			colArr = append(colArr, strRune)
		}
	}
	var col int
	//  为了方便限制在26*26*26
	switch len(colArr) {
	case 3:
		col = chMap[string(colArr[0])]*26*26 + chMap[string(colArr[1])]*26 + chMap[string(colArr[2])]
	case 2:
		col = chMap[string(colArr[0])]*26 + chMap[string(colArr[1])]
	case 1:
		col = chMap[string(colArr[0])]
	}
	var rowStr string
	for _, r := range rowArr {
		rowStr += string(r)
	}
	atoi, err := strconv.Atoi(rowStr)
	if err != nil {
		return Point{}
	}
	return Point{Col: col, Row: atoi}
}



type Point struct {
	Row int
	Col int
}

func (p *Point) NextCol() {
	p.Col += 1
}
func (p *Point) NextRow() {
	p.Row += 1
}
func (p *Point) trans() string {
	return chArr.GetAxis(*p)
}
func GetPoint(s string) Point {
	return chArr.Translate(s)
}


type ReadWay int

const (
	Col = ReadWay(1) //  按列聚合
	Row = ReadWay(2) //  按行聚合
)

type ReadParam struct {
	Point    Point
	Way      ReadWay
	FileName string
	Sheet    string
	EndPoint Point
}

func OpenFile(fileName string) (*excelize.File, error) {
	file, err := excelize.OpenFile(fileName)
	if err != nil {
		logger.Log.Errorf("open excel file error %v", err)
		return nil, err
	}
	return file, err
}

// ReadListFromPoint
/*
  【Description】: 从一个点出发 在end point 之间的表格做出统计
*/
func ReadListFromPoint(p ReadParam) (map[string][]string, error) {
	file, err := OpenFile(p.FileName)
	if err != nil {
		return nil, err
	}
	defer func() {
		file.Close()
	}()
	m := make(map[string][]string)
	switch p.Way {
	case Col: //  按列聚合
		startCol := p.Point.Col
		for p.Point.Row < p.EndPoint.Row {
			p.Point.NextRow()
			trans := p.Point.trans()
			idx, err := file.GetCellValue(p.Sheet, trans)
			if err != nil {
				return nil, err
			}
			for p.Point.Col < p.EndPoint.Col {
				p.Point.NextCol()
				val, _ := file.GetCellValue(p.Sheet, p.Point.trans())
				m[idx] = append(m[idx], val)
			}
			p.Point.Col = startCol
		}

	case Row: //  按行聚合
		startRow := p.Point.Row
		for p.Point.Col < p.EndPoint.Col {
			p.Point.NextCol()
			trans := p.Point.trans()
			idx, err := file.GetCellValue(p.Sheet, trans)
			if err != nil {
				return nil, err
			}
			for p.Point.Row < p.EndPoint.Row {
				p.Point.NextRow()
				val, _ := file.GetCellValue(p.Sheet, p.Point.trans())
				m[idx] = append(m[idx], val)
			}
			p.Point.Row = startRow
		}
	}
	return m, nil
}
```

比较坑的地方是用官方的按行读取读行标题的时候会导致之前读取的数据被回收，也就是 map 中的数据被清空。
建议是深度拷贝再进行按行列读取
